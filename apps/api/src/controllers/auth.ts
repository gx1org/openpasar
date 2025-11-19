import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store, User } from "../schema.js";
import { eq } from "drizzle-orm";
import { generateJwt } from "../utils/jwt.js";
import { getConfig } from "../config.js";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { authSchema } from "../validators/user.js";

export const authorize = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(authSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const appId = await getConfig('autzorg_app_id');
  const res = await fetch(`https://autz.org/api/client/${appId}/userinfo?code=${req.auth_code}`)
  const data = await res.json()
  if (!res.ok) {
    return c.json({ message: data.message }, 400);
  }

  const users = await db.select().from(User).where(eq(User.autzorg_id, data.user.id));
  let isNewUser = false
  if (users.length === 0) {
    const [newUser] = await db.insert(User).values({
      autzorg_id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      phone: data.user.phone,
    }).returning();
    users.push(newUser);
    isNewUser = true
  }
  
  const user = users[0];
  let store = {
    id: 0
  }
  if (!isNewUser) {
    [store] = await db.select()
      .from(Store)
      .where(eq(Store.user_id, user.id)).limit(1);
  }

  const token = await generateJwt(String(user.id), user.email, String(store?.id || 0));
  const adminEmail = await getConfig('admin_email')
  return c.json({ message: "Authorized",
    token,
    user,
    store,
    isAdmin: user.email == adminEmail,
  });
}

export const refreshToken = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
  if (!user) {
    return c.json({ message: "Pengguna tidak ditemukan" }, 404);
  }
  const [store] = await db.select()
    .from(Store)
    .where(eq(Store.user_id, userId))
    .limit(1);
  const token = await generateJwt(String(userId), user.email, String(store?.id || 0));
  const adminEmail = await getConfig('admin_email')
  return c.json({ message: "Authorized",
    token,
    user,
    store,
    isAdmin: user.email == adminEmail,
  });
}
