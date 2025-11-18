import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { and, desc, eq, ilike, ne } from "drizzle-orm";
import { storeCreateUpdateSchema, storeListSchema } from "../validators/user.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const storeList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(storeListSchema, c.req.query())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const searchQuery = req.search ? ilike(Store.name, `%${req.search}%`) : undefined;
  const orderByMap = {
    latest: desc(Store.created_at),
    sales: desc(Store.sales_count),
  };
  const orderBy = orderByMap[req.sort as keyof typeof orderByMap];

  const stores = await db.select()
    .from(Store)
    .where(and(
      searchQuery,
    ))
    .orderBy(orderBy, orderByMap['latest'])
    .limit(limit)
    .offset(offset);

  return c.json({ stores });
}

export const storeCreate = async (c: Context): Promise<HandlerResponse<any>> => {
  const existingStore = Number(c.get('jwtPayload')?.store_id);
  if (existingStore) {
    return c.json({ message: "Anda sudah memiliki toko" }, 400);
  }

  const valid = z.safeParse(storeCreateUpdateSchema,  c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data
  const [check] = await db.select()
    .from(Store)
    .where(eq(Store.name, req.name))
    .limit(1);
  if (check) {
    return c.json({ message: "Nama toko sudah dipakai" }, 400);
  }

  const [store] = await db.insert(Store).values({
    user_id: c.get('jwtPayload')?.id,
    name: req.name,
    email: req.email,
    phone: req.phone,
    description: req.description,
  }).returning()
  return c.json({ store });
}


export const storeUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const valid = z.safeParse(storeCreateUpdateSchema, c.req.json())
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
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

export const storeDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  const [store] = await db.select().from(Store).where(eq(Store.id, id));
  if (!store) {
    return c.json({ message: "Toko tidak ditemukan" }, 404);
  }

  return c.json({ store });
}
