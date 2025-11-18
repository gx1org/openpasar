import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User } from "../../schema.js";
import { db } from "../../db.js";
import { eq } from "drizzle-orm";

export const adminUserList = async (c: Context): Promise<HandlerResponse<any>> => {
  const users = await db.select().from(User);
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
