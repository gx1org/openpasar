import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { eq } from "drizzle-orm";

export const storeCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({})
}

export const storeDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({})
}

export const storeUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const store = c.get('store');
    const body = await c.req.json();
    const updatedStore = {
        name: body.name,
        email: body.email,
        phone: body.phone
    }
    await db.update(Store).set(updatedStore).where(eq(Store.id, store.id));

    return c.json({ store: {
        ...store,
        ...updatedStore,
    } })
}