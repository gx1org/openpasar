import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Transaction } from "../schema.js";
import { and, desc, eq, ilike, notInArray, or } from "drizzle-orm";

export const storeTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    const store = c.get('store');
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';

    const transactions = await db.select()
        .from(Transaction)
        .where(and(
            eq(Transaction.store_id, store.id),
            notInArray(Transaction.status, ['pending', 'failed']),
            search === '' ? undefined :
            or(
                ilike(Transaction.id, `%${search}%`),
                ilike(Transaction.description, `%${search}%`)
            ),
            status === '' ? undefined :
            eq(Transaction.status, status)
        ))
        .orderBy(desc(Transaction.created_at));
    return c.json({ transactions });
}

export const storeTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const store = c.get('store');
    const id = c.req.param('id');
    const [transaction] = await db.select().from(Transaction)
        .where(and(
            eq(Transaction.id, Number(id)),
            eq(Transaction.store_id, store.id),
            notInArray(Transaction.status, ['pending', 'failed']),
        ))
        .limit(1)
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }

    return c.json({ transaction });
}

export const storeTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    return c.json({ message: `Transaction ${id} status updated to ${status}` });
}