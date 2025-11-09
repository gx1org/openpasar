import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store, Transaction } from "../schema.js";
import { and, desc, eq } from "drizzle-orm";
import { stat } from "fs";

export const transactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const transactions = await db.select().from(Transaction)
        .where(eq(Transaction.buyer_id, userId))
        .orderBy(desc(Transaction.created_at));
    return c.json({ transactions });
}

export const transactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const id = c.req.param('id')
    const userId = c.get('jwtPayload')?.id;
    const [transaction] = await db.select({
        id: Transaction.id,
        store_name: Store.name,
        store_phone: Store.phone,
        status: Transaction.status,
        created_at: Transaction.created_at,
        total_amount: Transaction.total_amount,
        checkout_note: Transaction.checkout_note,
        description: Transaction.description,
        items: Transaction.items,
        histories: Transaction.histories,
    })
        .from(Transaction)
        .innerJoin(Store, eq(Transaction.store_id, Store.id))
        .where(and(
            eq(Transaction.id, Number(id)),
            eq(Transaction.buyer_id, userId)
        ))
        .limit(1);
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }

    return c.json({ transaction });
}

export const transactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    return c.json({ message: `Transaction ${id} status updated to ${status}` });
}

export const storeTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ transactions: [] });
}

export const storeTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ transaction: { id } });
}

export const storeTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    return c.json({ message: `Transaction ${id} status updated to ${status}` });
}