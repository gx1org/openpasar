import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store, User } from "../../schema.js";
import { db } from "../../db.js";
import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { parseError } from "../../utils/helper.js";
import { storeCreateUpdateSchema, userListSchema } from "../../validators/admin.js";
import z from "zod";

export const adminStoreList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(userListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const where = or(
    ilike(Store.name, `%${req.search}%`),
    ilike(Store.email, `%${req.search}%`),
    ilike(Store.phone, `%${req.search}%`),
  )
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Store)
    .where(where)

  const stores = await db.select({
    id: Store.id,
    name: Store.name,
    email: Store.email,
    phone: Store.phone,
    description: Store.description,
    sales_count: Store.sales_count,
    created_at: Store.created_at,
    user_id: Store.user_id,
    user_name: User.name,
  }).from(Store)
  .innerJoin(User, eq(Store.user_id, User.id))
    .where(where)
    .orderBy(desc(Store.created_at))
    .limit(limit)
    .offset(offset);

  return c.json({ stores, total: Number(total[0].count) });
}

export const adminStoreDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  const [store] = await db.select().from(Store).where(eq(Store.id, id)).limit(1);
  if (!store) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  return c.json({ store });
}


export const adminStoreCreate = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(storeCreateUpdateSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const [hasStore] = await db.select().from(Store).where(eq(Store.user_id, req.user_id)).limit(1);
  if (hasStore) {
    return c.json({ message: "Pengguna sudah memiliki toko" }, 400);
  }

  const [check] = await db.select()
    .from(Store)
    .where(eq(Store.name, req.name))
    .limit(1);
  if (check) {
    return c.json({ message: "Nama toko sudah dipakai" }, 400);
  }

  const [store] = await db.insert(Store).values({
    user_id: req.user_id,
    name: req.name,
    email: req.email,
    phone: req.phone,
    description: req.description,
  }).returning()
  return c.json({ store });
}


export const adminStoreUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  const valid = z.safeParse(storeCreateUpdateSchema, await c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const [store] = await db.select().from(Store).where(eq(Store.id, id)).limit(1);
  if (!store) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  const req = valid.data
  if (req.name !== store.name) {
    const [check] = await db.select()
      .from(Store)
      .where(and(
        eq(Store.name, req.name),
        ne(Store.id, store.id)
      ))
      .limit(1);
    if (check) {
      return c.json({ message: 'Nama toko sudah dipakai' }, 400);
    }
  }

  await db.update(Store).set({
    name: req.name,
    email: req.email,
    phone: req.phone,
    description: req.description,
  }).where(eq(Store.id, store.id));
  return c.json({
    store: {
      ...store,
      ...req,
    }
  })
}
