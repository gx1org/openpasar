import type { Context } from "hono";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { getConfig } from "../config.js";

export const hasStore = async (c: Context, next: () => Promise<void>) => {
  const id = Number(c.get('jwtPayload')?.store_id);
  if (isNaN(id)) {
    return c.json({ message: 'Hanya toko yang dapat menggunakan fitur ini' }, 403);
  }

  const [store] = await db.select().from(Store).where(eq(Store.id, id));
  if (!store) {
    return c.json({ message: 'Hanya toko yang dapat menggunakan fitur ini' }, 403);
  }

  c.set('store', store);
  return next();
}

export const isAdmin = async (c: Context, next: () => Promise<void>) => {
  const admin_email = await getConfig('admin_email');
  const userEmail = c.get('jwtPayload')?.email;
  if (userEmail != admin_email) {
    return c.json({ message: 'Not admin' }, 403);
  }

  return next()
}

export const initialConfig = async (c: Context, next: () => Promise<void>) => {
  const installed = await getConfig('installed');
  if (installed == 'yes') {
    return c.json({ message: 'Already installed' }, 403);
  }

  return next()
}