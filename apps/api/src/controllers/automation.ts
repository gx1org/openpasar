import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db, runMigration } from "../db.js";
import { Store, Transaction, User } from "../schema.js";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { sendEmail } from "../utils/email.js";
import { getConfig } from "../config.js";

export const runAutomation = async (c: Context): Promise<HandlerResponse<any>> => {
  const cronjobSecret = await getConfig('cronjob_secret')
  if (cronjobSecret != c.req.query('secret')) {
    return c.json({ message: "Wrong secret" }, 400);
  }

  console.log(`Automation running...`);

  cancelUnpaidTransaction()
  completeSentTransaction()
  return c.json({ message: "Success" });
}

const cancelUnpaidTransaction = async (): Promise<void> => {
  const cutoff = dayjs().subtract(1, 'day').toDate()
  await db.update(Transaction)
    .set({ status: 'canceled' })
    .where(and(
      eq(Transaction.status, 'pending'),
      lt(Transaction.created_at, cutoff)
    ))
  return
}

const completeSentTransaction = async (): Promise<void> => {
  const cutoff = dayjs().subtract(2, 'days').toDate()
  const transactions = await db.select({
    id: Transaction.id,
    total_amount: Transaction.total_amount,
    store_id: Transaction.store_id,
    buyer_id: Transaction.buyer_id,
    user_email: User.email,
    user_name: User.name,
    store_email: Store.email,
    store_name: Store.name,
  }).from(Transaction)
    .innerJoin(User, eq(Transaction.buyer_id, User.id))
    .innerJoin(Store, eq(Transaction.store_id, Store.id))
    .where(and(
      eq(Transaction.status, 'sent'),
      lt(Transaction.created_at, cutoff)
    ))

  const sellerFee = await getConfig('seller_fee');
  for (const txn of transactions) {
    const fee = Math.round((Number(txn.total_amount) * Number(sellerFee)) / 100);
    const income = Math.round(Number(txn.total_amount) - fee);

    await db.update(Store)
      .set({ sales_count: sql`${Store.sales_count} + 1` })
      .where(eq(Store.id, txn.store_id));

    await db.update(User)
      .set({ balance: sql`${User.balance} + ${income}` })
      .where(eq(User.id, txn.buyer_id));

    sendEmail(
      txn.store_email,
      `Pesanan #${txn.id} diselesaikan system`,
      `Hai ${txn.store_name},
              
Pesanan #${txn.id} diselesaikan oleh system.

Saldo Anda telah bertambah Rp ${income} (Rp ${txn.total_amount} - Rp ${fee}).

Silahkan login ke dashboard untuk melihat detail pesanan.`)

    sendEmail(
      txn.user_email,
      `Pesanan #${txn.id} diselesaikan system`,
      `Hai ${txn.user_name},
              
Pesanan #${txn.id} diselesaikan oleh system.

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }

  return
}
