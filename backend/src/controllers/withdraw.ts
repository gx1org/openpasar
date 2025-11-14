import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { User, Withdrawal } from "../schema.js";
import { desc, eq, sql } from "drizzle-orm";

export const withdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const withdrawals = await db.select()
    .from(Withdrawal)
    .where(eq(Withdrawal.user_id, userId))
    .orderBy(desc(Withdrawal.created_at));
    return c.json({ withdrawals });
}

export const withdrawalCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { amount, receiver } = await c.req.json();
    const wd = {
        user_id: c.get('jwtPayload')?.id,
        amount,
        receiver,
        status: 'in_process',
    };

    const [user] = await db.select().from(User).where(eq(User.id, wd.user_id)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    if (amount > user.balance) {
        return c.json({ message: "Insufficient balance" }, 400);
    }
    if (amount < 1) {
        return c.json({ message: "Invalid amount" }, 400);
    }
    if (!receiver) {
        return c.json({ message: "Receiver is required" }, 400);
    }

    const [withdrawal] = await db.insert(Withdrawal).values(wd).returning();
    if (withdrawal) {
        await db.update(User)
            .set({ balance: sql`${User.balance} - ${amount}` })
            .where(eq(User.id, wd.user_id));
    }
    return c.json({ message: `Withdrawal of ${amount} created`, withdrawal });
}
