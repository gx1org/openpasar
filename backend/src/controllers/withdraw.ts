import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { User, Withdrawal } from "../schema.js";
import { desc, eq, sql } from "drizzle-orm";
import { withdrawalCreateSchema } from "../validators/user.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const withdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const withdrawals = await db.select()
    .from(Withdrawal)
    .where(eq(Withdrawal.user_id, userId))
    .orderBy(desc(Withdrawal.created_at));
  return c.json({ withdrawals });
}

export const withdrawalCreate = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(withdrawalCreateSchema, c.req.json())
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

  const [withdrawal] = await db.insert(Withdrawal).values(wd).returning();
  if (withdrawal) {
    await db.update(User)
      .set({ balance: sql`${User.balance} - ${req.amount}` })
      .where(eq(User.id, wd.user_id));
  }
  return c.json({ message: `Withdrawal of ${req.amount} created`, withdrawal });
}
