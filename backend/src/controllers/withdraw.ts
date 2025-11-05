import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const withdrawList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ withdrawals: [] });
}

export const withdrawCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { amount, method } = await c.req.json();
    return c.json({ message: `Withdrawal of ${amount} via ${method} created` });
}
