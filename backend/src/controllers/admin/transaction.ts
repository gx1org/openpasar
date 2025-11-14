import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../../db.js";
import { Store, Transaction, User } from "../../schema.js";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";

export const adminTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';

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
        .where(and(
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

export const adminTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const id = c.req.param('id');
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
            eq(Transaction.id, Number(id)),
        ))
        .limit(1)
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }

    return c.json({ transaction });
}

export const adminTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status, note } = await c.req.json();
    const [transaction] = await db.select().from(Transaction)
        .where(and(
            eq(Transaction.id, Number(id)),
        ))
        .limit(1)
    if (!transaction) {
        return c.json({ message: "Transaction not found" }, 404);
    }

    if (!note) {
        return c.json({ message: "Note is required" }, 400);
    }

    const updated = await db.update(Transaction)
        .set({
            status,
            admin_response: note
        })
        .where(eq(Transaction.id, Number(id)));
    return c.json({ updated });
}