import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../../db.js";
import { Store, Transaction, User } from "../../schema.js";
import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { sendEmail } from "../../utils/email.js";
import { getConfig } from "../../config.js";
import { transactionListSchema, transactionStatusUpdateSchema } from "../../validators/admin.js";
import z from "zod";
import { parseError } from "../../utils/helper.js";

export const adminTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(transactionListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const where = and(
    req.search === '' ? undefined :
      or(
        ilike(Transaction.id, `%${req.search}%`),
        ilike(Transaction.description, `%${req.search}%`)
      ),
      req.status ? eq(Transaction.status, req.status) : undefined,
  )
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Transaction)
    .where(where)

  const transactions = await db.select({
    id: Transaction.id,
    description: Transaction.description,
    status: Transaction.status,
    created_at: Transaction.created_at,
    total_amount: Transaction.total_amount,
    store: {
      name: Store.name,
      phone: Store.phone,
    },
  })
    .from(Transaction)
    .innerJoin(Store, eq(Transaction.store_id, Store.id))
    .where(where)
    .orderBy(desc(Transaction.created_at))
    .limit(limit)
    .offset(offset)

  return c.json({ transactions, total: Number(total[0].count) });
}

export const adminTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Transaksi tidak ditemukan" }, 404);
  }

  const [transaction] = await db.select({
    id: Transaction.id,
    description: Transaction.description,
    checkout_note: Transaction.checkout_note,
    seller_response: Transaction.seller_response,
    status: Transaction.status,
    created_at: Transaction.created_at,
    total_amount: Transaction.total_amount,
    buyer: {
      name: User.name,
      phone: User.phone,
    },
    items: Transaction.items,
    store_name: Store.name,
    store_phone: Store.phone,
    store_sales_count: Store.sales_count,
    store_id: Transaction.store_id,
  })
    .from(Transaction)
    .innerJoin(User, eq(Transaction.buyer_id, User.id))
    .innerJoin(Store, eq(Transaction.store_id, Store.id))
    .where(and(
      eq(Transaction.id, id),
    ))
    .limit(1)
  if (!transaction) {
    return c.json({ message: "Transaksi tidak ditemukan" }, 404);
  }

  return c.json({ transaction });
}

export const adminTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Transaksi tidak ditemukan" }, 404);
  }

  const valid = z.safeParse(transactionStatusUpdateSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const [transaction] = await db.select().from(Transaction)
    .where(and(
      eq(Transaction.id, id),
    ))
    .limit(1)
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }
  const updatable = ['in_process', 'sent', 'complained'];
  if (!updatable.includes(transaction.status)) {
    return c.json({ message: "Transaction status is not updatable" }, 400);
  }

  const updated = await db.update(Transaction)
    .set({
      status: req.status,
      admin_response: req.note
    })
    .where(eq(Transaction.id, id));

  const [store] = await db.select().from(Store)
    .where(eq(Store.id, transaction.store_id))
    .limit(1);
  const [user] = await db.select().from(User)
    .where(eq(User.id, transaction.buyer_id))
    .limit(1);

  if (req.status === 'completed') {
    const sellerFee = await getConfig('seller_fee');
    const fee = Math.round((Number(transaction.total_amount) * Number(sellerFee)) / 100);
    const income = Math.round(Number(transaction.total_amount) - fee);

    await db.update(Store)
      .set({ sales_count: sql`${Store.sales_count} + 1` })
      .where(eq(Store.id, transaction.store_id));

    await db.update(User)
      .set({ balance: sql`${User.balance} + ${income}` })
      .where(eq(User.id, store.user_id));

    sendEmail(
      store.email,
      `Pesanan #${transaction.id} diselesaikan admin`,
      `Hai ${store.name},
              
Pesanan #${transaction.id} diselesaikan oleh admin.

Saldo Anda telah bertambah Rp ${income} (Rp ${transaction.total_amount} - Rp ${fee}).

Silahkan login ke dashboard untuk melihat detail pesanan.`)

    sendEmail(
      user.email,
      `Pesanan #${transaction.id} diselesaikan admin`,
      `Hai ${user.name},
              
Pesanan #${transaction.id} diselesaikan oleh admin.

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }

  if (req.status === 'canceled') {
    await db.update(User)
      .set({ balance: sql`${User.balance} + ${transaction.total_amount}` })
      .where(eq(User.id, transaction.buyer_id));

    sendEmail(
      store.email,
      `Pesanan #${transaction.id} dibatalkan admin`,
      `Hai ${store.name},
              
Pesanan #${transaction.id} telah dibatalkan oleh admin.

Silahkan login ke dashboard untuk melihat detail pesanan.`)

    sendEmail(
      user.email,
      `Pesanan #${transaction.id} dibatalkan admin`,
      `Hai ${user.name},
              
Pesanan #${transaction.id} telah dibatalkan oleh admin.

Nominal transaksi telah di-refund ke saldo Anda (Rp ${transaction.total_amount}).

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }

  return c.json({ updated });
}
