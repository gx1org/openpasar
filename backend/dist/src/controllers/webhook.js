import { Transaction } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig } from "../config.js";
export const webhookPakasir = async (c) => {
    const { order_id } = await c.req.json();
    if (!Number(order_id)) {
        return c.json({ message: "Invalid order id" }, 400);
    }
    const [transaction] = await db.select().from(Transaction).where(eq(Transaction.id, Number(order_id))).limit(1);
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }
    if (transaction.status !== 'pending') {
        return c.json({ message: "Transaction is not pending. It's " + transaction.status }, 400);
    }
    const isCompleted = await checkOnPakasir(transaction.id, transaction.total_amount);
    if (!isCompleted) {
        return c.json({ message: "Transaction is not completed" }, 400);
    }
    await db.update(Transaction).set({ status: 'in_process' }).where(eq(Transaction.id, order_id));
    return c.json({ message: "Success" });
};
const checkOnPakasir = async (id, amount) => {
    const slug = await getConfig('pakasir_slug');
    const apiKey = await getConfig('pakasir_api_key');
    const url = `https://app.pakasir.com/api/transactiondetail?project=${slug}&order_id=${id}&amount=${amount}&api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.log(`Error fetching pakasir transaction:`, res.body);
        return false;
    }
    const txn = await res.json();
    if (txn.transaction.status !== 'completed') {
        return false;
    }
    return true;
};
