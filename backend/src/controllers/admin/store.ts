import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { Store } from "../../schema.js";
import { db } from "../../db.js";
import { eq } from "drizzle-orm";

export const adminStoreList = async (c: Context): Promise<HandlerResponse<any>> => {
  const stores = await db.select().from(Store);
  return c.json({ stores });
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
