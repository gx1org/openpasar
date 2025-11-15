import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store, Transaction } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig } from "../config.js";
import { sendEmail } from "../utils/email.js";

export const webhookPakasir = async (c: Context): Promise<HandlerResponse<any>> => {
    const { order_id } = await c.req.json();
    if (!Number(order_id)) {
        return c.json({ message: "Invalid order id" }, 400);
    }

    const [transaction] = await db.select().from(Transaction).where(eq(Transaction.id, Number(order_id))).limit(1);
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }
    if (transaction.status !== 'pending') {
        return c.json({ message: "Transaction is not pending. It's "+transaction.status }, 400);
    }

    const isCompleted = await checkOnPakasir(transaction.id, transaction.total_amount);
    if (!isCompleted) {
        return c.json({ message: "Transaction is not completed" }, 400);
    }

    await db.update(Transaction).set({ status: 'in_process' }).where(eq(Transaction.id, order_id));
    const [store] = await db.select().from(Store).where(eq(Store.id, transaction.store_id)).limit(1);
    sendEmail(
        store.email,
        "Ada pesanan baru di " + store.name,
        `Hai ${store.name},

Ada pesanan masuk dengan nominal ${transaction.total_amount}. Silahkan login ke dashboard untuk melihat detail pesanan.
`
    )
    return c.json({ message: "Success" });
}

const checkOnPakasir = async (id: number, amount: number): Promise<boolean> => {
    const slug = await getConfig('pakasir_slug');
    const apiKey = await getConfig('pakasir_api_key');
    const url = `https://app.pakasir.com/api/transactiondetail?project=${slug}&order_id=${id}&amount=${amount}&api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.log(`Error fetching pakasir transaction:`, res.body);
        return false
    }
    const txn = await res.json();
    if (txn.transaction.status !== 'completed') {
        return false
    }
    return true
}