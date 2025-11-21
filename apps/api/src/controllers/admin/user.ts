import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store, User } from "../../schema.js";
import { db } from "../../db.js";
import { eq, ilike, is, or } from "drizzle-orm";
import z from "zod";
import { userListSchema } from "../../validators/admin.js";
import { parseError } from "../../utils/helper.js";

export const adminUserList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(userListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const search = valid.data.search;
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
    .where(
      or(
        ilike(User.name, `%${search}%`),
        ilike(User.email, `%${search}%`),
        ilike(User.phone, `%${search}%`),
      )
    );
  return c.json({ users });
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