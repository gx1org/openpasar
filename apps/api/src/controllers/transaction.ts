import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product, Store, Transaction, User } from "../schema.js";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { sendEmail } from "../utils/email.js";
import { getConfig } from "../config.js";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { transactionListSchema, transactionStatusUpdateSchema } from "../validators/user.js";
import { getJwtPayload } from "../utils/jwt.js";

export const transactionList = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = Number(getJwtPayload(c).id);
  const valid = z.safeParse(transactionListSchema, c.req.query())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }
  
  const req = valid.data
  let searchQuery = undefined
  if (req.search !== '') {
    searchQuery = ilike(Transaction.description, `%${req.search}%`)
    if (Number(req.search)) {
      searchQuery = eq(Transaction.id, Number(req.search))
    }
  }
  const where = and(
    eq(Transaction.buyer_id, userId),
    searchQuery,
    req.status ? eq(Transaction.status, req.status) : undefined,
  )
  const limit = 10
  const offset = (req.page - 1) * limit

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Transaction)
    .where(where)

  const transactions = await db.select().from(Transaction)
    .where(where)
    .orderBy(desc(Transaction.created_at))
    .limit(limit)
    .offset(offset)

  return c.json({ transactions, total: Number(total[0].count) });
}

export const transactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }
  const userId = Number(getJwtPayload(c).id);
  const [transaction] = await db.select({
    id: Transaction.id,
    store_id: Store.id,
    store_name: Store.name,
    store_sales_count: Store.sales_count,
    store_phone: Store.phone,
    status: Transaction.status,
    created_at: Transaction.created_at,
    total_amount: Transaction.total_amount,
    checkout_note: Transaction.checkout_note,
    seller_response: Transaction.seller_response,
    description: Transaction.description,
    items: Transaction.items,
  })
    .from(Transaction)
    .innerJoin(Store, eq(Transaction.store_id, Store.id))
    .where(and(
      eq(Transaction.id, Number(id)),
      eq(Transaction.buyer_id, userId)
    ))
    .limit(1);
  if (!transaction) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  return c.json({ transaction });
}

export const transactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  const req = await c.req.json();
  const valid = z.safeParse(transactionStatusUpdateSchema, req)
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const userId = Number(getJwtPayload(c).id);
  const [transaction] = await db.select().from(Transaction)
    .where(and(
      eq(Transaction.id, Number(id)),
      eq(Transaction.buyer_id, userId)
    ))
    .limit(1)
  if (!transaction) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  const updatableStatus: { [key: string]: string[] } = {
    pending: ['canceled'],
    sent: ['completed', 'complained'],
    complained: ['completed'],
  }
  if (!Object.keys(updatableStatus).includes(transaction.status)) {
    return c.json({ message: 'Status transaksi tidak dapat diubah' }, 400);
  }
  if (!updatableStatus[transaction.status].includes(req.status)) {
    return c.json({ message: 'Status transaksi tidak valid' }, 400);
  }

  const updated = await db.update(Transaction)
    .set({ status: req.status })
    .where(eq(Transaction.id, id));
  const [store] = await db.select().from(Store)
    .where(eq(Store.id, transaction.store_id))
    .limit(1);
  if (req.status === 'complained') {
    sendEmail(
      store.email,
      `Pesanan #${transaction.id} dikomplain pembeli`,
      `Hai ${store.name},
      
Pesanan #${transaction.id} dikomplain pembeli. Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }
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
    
    await db.update(Product)
      .set({
        sold_count: sql`${Product.sold_count} + 1`,
        in_stock: sql`CASE WHEN ${Product.in_stock} = 'one' THEN 'empty' ELSE ${Product.in_stock} END`,
      })
      .where(eq(Product.id, transaction.items[0].product_id));

    sendEmail(
      store.email,
      `Pesanan #${transaction.id} diselesaikan pembeli`,
      `Hai ${store.name},
      
Pesanan #${transaction.id} diselesaikan pembeli.

Saldo Anda telah bertambah Rp ${income} (Rp ${transaction.total_amount} - Rp ${fee}).

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }
  return c.json({ updated });
}
