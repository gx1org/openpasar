import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store, Transaction } from "../schema.js";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export const transactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';
    let searchQuery = undefined
    if (search !== '') {
        searchQuery = ilike(Transaction.description, `%${search}%`)
        if (parseInt(search)) {
            searchQuery = eq(Transaction.id, parseInt(search))
        }
    }

    const transactions = await db.select().from(Transaction)
        .where(and(
            eq(Transaction.buyer_id, userId),
            searchQuery,
            status === '' ? undefined :
            eq(Transaction.status, status)
        ))
        .orderBy(desc(Transaction.created_at));
    return c.json({ transactions });
}

export const transactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const id = c.req.param('id')
    const userId = c.get('jwtPayload')?.id;
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
    const userId = c.get('jwtPayload')?.id;
    const [transaction] = await db.select().from(Transaction)
        .where(and(
            eq(Transaction.id, Number(id)),
            eq(Transaction.buyer_id, userId)
        ))
        .limit(1)
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }

    const updatableStatus: { [key: string]: string[] } = {
        pending: ['canceled'],
        sent: ['completed', 'complained'],
        complained: ['completed'],
    }
    if (!Object.keys(updatableStatus).includes(transaction.status)) {
        return c.json({ message: "Transaction status is not updatable" }, 400);
    }    
    if (!updatableStatus[transaction.status].includes(status)) {
        return c.json({ message: "Invalid status" }, 400);
    }

    const updated = await db.update(Transaction)
        .set({ status })
        .where(eq(Transaction.id, Number(id)));
    return c.json({ updated });
}
