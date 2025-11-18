import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store, Transaction } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig } from "../config.js";
import { sendEmail } from "../utils/email.js";
import { webhookPakasirSchema } from "../validators/user.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const webhookPakasir = async (c: Context): Promise<HandlerResponse<any>> => {
  const req = await c.req.json();
  const valid = z.safeParse(webhookPakasirSchema, req)
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }
  const order_id = Number(req.order_id)

  const [transaction] = await db.select().from(Transaction).where(eq(Transaction.id, order_id)).limit(1);
  if (!transaction) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }
  if (transaction.status !== 'pending') {
    return c.json({ message: 'Transaksi tidak pending. Status: ' + transaction.status }, 400);
  }
  if (req.amount < transaction.total_amount) {
    return c.json({ message: 'Nominal tidak sesuai' }, 400);
  }

  const isCompleted = await checkOnPakasir(transaction.id, transaction.total_amount);
  if (!isCompleted) {
    return c.json({ message: 'Transaksi belum dibayar' }, 400);
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
    console.log(`Error saat mengecek transaksi:`, res.body);
    return false
  }
  const txn = await res.json();
  if (txn.transaction.status !== 'completed') {
    return false
  }
  return true
}