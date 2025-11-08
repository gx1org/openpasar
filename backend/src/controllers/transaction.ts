import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Transaction } from "../schema.js";
import { desc, eq } from "drizzle-orm";

export const transactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const transactions = await db.select().from(Transaction)
        .where(eq(Transaction.buyer_id, userId))
        .orderBy(desc(Transaction.created_at));
    return c.json({ transactions });
}

export const transactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ transaction: { id } });
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