import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store, User } from "../../schema.js";
import { db } from "../../db.js";
import { desc, eq, ilike, is, or, sql } from "drizzle-orm";
import z from "zod";
import { userListSchema } from "../../validators/admin.js";
import { parseError } from "../../utils/helper.js";

export const adminUserList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(userListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const where = or(
    ilike(User.name, `%${req.search}%`),
    ilike(User.email, `%${req.search}%`),
    ilike(User.phone, `%${req.search}%`),
  )
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(User)
    .where(where)

  const users = await db.select({
    id: User.id,
    name: User.name,
    email: User.email,
    phone: User.phone,
    created_at: User.created_at,
    balance: User.balance,
    is_suspended: User.is_suspended,
    store: {
      id: Store.id,
      name: Store.name,
      email: Store.email,
      phone: Store.phone,
    }
  }).from(User)
    .leftJoin(Store, eq(User.id, Store.user_id))
    .where(where)
    .orderBy(desc(User.created_at))
    .limit(limit)
    .offset(offset);

  return c.json({ users, total: Number(total[0].count) });
}

export const adminUserDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  const [user] = await db.select().from(User).where(eq(User.id, id));
  if (!user) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  return c.json({ user });
}

export const adminUserSuspendStatusUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  const [user] = await db.select().from(User).where(eq(User.id, id));
  if (!user) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  await db.update(User)
    .set({
      is_suspended: !user.is_suspended,
    })
    .where(eq(User.id, id));
  return c.json({ message: `User ${id} suspend status updated to ${!user.is_suspended}` });
}

export const adminUserResetPin = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  const [user] = await db.select().from(User).where(eq(User.id, id));
  if (!user) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }

  await db.update(User)
    .set({
      hashed_pin: '',
    })
    .where(eq(User.id, id));
  return c.json({ message: `User ${id} pin reset` });
}