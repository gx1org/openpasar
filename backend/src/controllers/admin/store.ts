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
    const { id } = c.req.param();
    const stores = await db.select().from(Store).where(eq(Store.id, Number(id)));
    if (stores.length === 0) {
        return c.json({ message: "Store not found" }, 404);
    }
    const store = stores[0];
    return c.json({ store });
}
