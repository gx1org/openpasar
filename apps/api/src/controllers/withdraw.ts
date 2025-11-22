import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { User, Withdrawal } from "../schema.js";
import { desc, eq, sql } from "drizzle-orm";
import { withdrawalCreateSchema, withdrawalListSchema } from "../validators/user.js";
import z from "zod";
import { hashString, parseError } from "../utils/helper.js";

export const withdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const valid = z.safeParse(withdrawalListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const where = eq(Withdrawal.user_id, userId)
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Withdrawal)
    .where(where)

  const withdrawals = await db.select()
    .from(Withdrawal)
    .where(where)
    .orderBy(desc(Withdrawal.created_at))
    .limit(limit)
    .offset(offset);

  return c.json({ withdrawals, total: Number(total[0].count) });
}

export const withdrawalCreate = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(withdrawalCreateSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const wd = {
    user_id: c.get('jwtPayload')?.id,
    amount: Number(req.amount),
    receiver: req.receiver,
    status: 'in_process',
  };

  const [user] = await db.select().from(User).where(eq(User.id, wd.user_id)).limit(1);
  if (!user) {
    return c.json({ message: 'Pengguna tidak ditemukan' }, 404);
  }
  if (req.amount > user.balance) {
    return c.json({ message: 'Saldo tidak mencukupi' }, 400);
  }
  const wdPin = await hashString(req.pin);
  if (user.hashed_pin !== wdPin) {
    return c.json({ message: "Invalid pin" }, 400);
  }
  
  const [withdrawal] = await db.insert(Withdrawal).values(wd).returning();
  if (withdrawal) {
    await db.update(User)
      .set({ balance: sql`${User.balance} - ${req.amount}` })
      .where(eq(User.id, wd.user_id));
  }
  return c.json({ message: `Withdrawal of ${req.amount} created`, withdrawal });
}
