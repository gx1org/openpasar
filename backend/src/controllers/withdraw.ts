import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Withdrawal } from "../schema.js";
import { desc, eq } from "drizzle-orm";

export const withdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const withdrawals = await db.select()
    .from(Withdrawal)
    .where(eq(Withdrawal.user_id, userId))
    .orderBy(desc(Withdrawal.created_at));
    return c.json({ withdrawals });
}

export const withdrawalCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { amount, bank_name, account_number, account_name } = await c.req.json();
    const wd = {
        user_id: c.get('jwtPayload')?.id,
        amount,
        bank_name,
        account_number,
        account_name,
        status: 'pending',
    };
    const [withdrawal] = await db.insert(Withdrawal).values(wd).returning();
    return c.json({ message: `Withdrawal of ${amount} created`, withdrawal });
}
