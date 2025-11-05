import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const adminTransactionList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ transactions: [] });
}

export const adminTransactionDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ transaction: { id } });
}

export const adminTransactionStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    return c.json({ message: `Transaction ${id} status updated to ${status}` });
}