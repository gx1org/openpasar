import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store, Transaction, User } from "../schema.js";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { sendEmail } from "../utils/email.js";
import { transactionListSchema, transactionStatusUpdateSchema } from "../validators/seller.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const storeTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const valid = z.safeParse(transactionListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const transactions = await db.select()
    .from(Transaction)
    .where(and(
      inArray(Transaction.status, ['in_process', 'sent', 'complained', 'completed', 'rejected']),
      eq(Transaction.store_id, store.id),
      req.search === '' ? undefined :
        or(
          ilike(Transaction.id, `%${req.search}%`),
          ilike(Transaction.description, `%${req.search}%`)
        ),
        req.status ? eq(Transaction.status, req.status) : undefined,
    ))
    .orderBy(desc(Transaction.created_at));
  return c.json({ transactions });
}

export const storeTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const id = Number(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
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
      inArray(Transaction.status, ['in_process', 'sent', 'complained', 'completed', 'rejected']),
      eq(Transaction.id, id),
      eq(Transaction.store_id, store.id),
    ))
    .limit(1)
  if (!transaction) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  return c.json({ transaction });
}

export const storeTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  const valid = z.safeParse(transactionStatusUpdateSchema, c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const store = c.get('store');
  const [transaction] = await db.select().from(Transaction)
    .where(and(
      eq(Transaction.id, id),
      eq(Transaction.store_id, store.id)
    ))
    .limit(1)
  if (!transaction) {
    return c.json({ message: 'Transaksi tidak ditemukan' }, 404);
  }

  const updatableStatus: { [key: string]: string[] } = {
    in_process: ['rejected', 'sent'],
  }
  if (!Object.keys(updatableStatus).includes(transaction.status)) {
    return c.json({ message: "Status transaksi tidak dapat diubah" }, 400);
  }

  const updated = await db.update(Transaction)
    .set({
      status: req.status,
      sent_at: req.status === 'sent' ? new Date() : transaction.sent_at,
      seller_response: req.note
    })
    .where(eq(Transaction.id, id));

  const [user] = await db.select().from(User)
    .where(eq(User.id, transaction.buyer_id))
    .limit(1);

  if (req.status === 'rejected') {
    await db.update(User)
      .set({ balance: sql`${User.balance} + ${transaction.total_amount}` })
      .where(eq(User.id, transaction.buyer_id));

    sendEmail(
      user.email,
      `Pesanan #${transaction.id} ditolak`,
      `Hai ${user.name},

Pesanan #${transaction.id} ditolak oleh penjual.

Nominal transaksi telah di-refund ke saldo Anda (Rp ${transaction.total_amount}).

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }

  if (req.status === 'sent') {
    sendEmail(
      user.email,
      `Pesanan #${transaction.id} telah dikirim`,
      `Hai ${user.name},

Pesanan #${transaction.id} telah dikirim oleh penjual.

Silahkan login ke dashboard untuk melihat detail pesanan.`)
  }

  return c.json({ updated });
}
