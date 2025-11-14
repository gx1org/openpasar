import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User, Withdrawal } from "../../schema.js";
import { db } from "../../db.js";
import { desc, eq, sql } from "drizzle-orm";

export const adminWithdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
    const withdrawals = await db.select().from(Withdrawal)
        .orderBy(
            desc(eq(Withdrawal.status, 'in_process')),
            desc(Withdrawal.created_at)
        );
    return c.json({ withdrawals });
}

export const adminWithdrawalApproveReject = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { status } = await c.req.json();

    const [withdrawal] = await db.select().from(Withdrawal)
        .where(eq(Withdrawal.id, Number(id)))
        .limit(1);
    if (!withdrawal) {
        return c.json({ message: "Withdrawal not found" }, 404);
    }

    await db.update(Withdrawal)
        .set({ status })
        .where(eq(Withdrawal.id, Number(id)));
    
    if (status === 'rejected') {
        await db.update(User)
            .set({ balance: sql`${User.balance} + ${withdrawal.amount}` })
            .where(eq(User.id, withdrawal.user_id));
    }
    return c.json({ message: `Withdrawal ${id} has been ${status}` });
}
