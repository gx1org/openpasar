import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig, setConfig } from "../config.js";
import { hashString } from "../utils/helper.js";
import { pinUpdateSchema, profileSchema } from "../validators/user.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const profile = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
  if (!user) {
    return c.json({ message: 'Pengguna tidak ditemukan' }, 404);
  }

  return c.json({ user });
}

export const updateProfile = async (c: Context): Promise<HandlerResponse<any>> => {
  const payload = c.get('jwtPayload');
  const valid = z.safeParse(profileSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const [user] = await db.select().from(User).where(eq(User.id, payload.id)).limit(1);
  if (!user) {
    return c.json({ message: 'Pengguna tidak ditemukan' }, 404);
  }

  const [check] = await db.select().from(User).where(eq(User.email, req.email)).limit(1);
  if (check) {
    return c.json({ message: 'Email sudah dipakai' }, 400);
  }

  await db.update(User)
    .set({
      name: req.name,
      phone: req.phone,
    })
    .where(eq(User.id, payload.id));

  const adminEmail = await getConfig('admin_email');
  if (user.email == adminEmail && user.email !== req.email) {
    await setConfig('admin_email', req.email)
  }

  return c.json({
    user: { ...user, ...req }
  });
}

export const updatePin = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload').id;
  const valid = z.safeParse(pinUpdateSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
  if (!user) {
    return c.json({ message: 'Pengguna tidak ditemukan' }, 404);
  }

  if (user.hashed_pin != '') {
    const hashedOldPin = await hashString(req.old_pin);
    if (user.hashed_pin !== hashedOldPin) {
      return c.json({ message: "Invalid old pin" }, 400);
    }
  }

  const hashedNewPin = await hashString(req.new_pin);
  await db.update(User)
    .set({
      hashed_pin: hashedNewPin,
    })
    .where(eq(User.id, user.id));
  return c.json({ message: "Success" });
}