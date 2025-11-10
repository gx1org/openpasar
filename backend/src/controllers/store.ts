import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { and, eq, ne } from "drizzle-orm";

export const storeCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    const body = await c.req.json();
    const [check] = await db.select()
    .from(Store)
    .where(eq(Store.name, body.name))
    .limit(1);
    if (check) {
        return c.json({ message: "Store name already exists" }, 400);
    }

    const [store] = await db.insert(Store).values({
        user_id: c.get('jwtPayload')?.id,
        name: body.name,
        email: body.email,
        phone: body.phone
    }).returning()
    return c.json({ store });
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
    const [check] = await db.select()
    .from(Store)
    .where(and(
        eq(Store.name, updatedStore.name),
        ne(Store.id, store.id)
    ))
    .limit(1);
    if (check) {
        return c.json({ message: "Store name already exists" }, 400);
    }

    await db.update(Store).set(updatedStore).where(eq(Store.id, store.id));
    return c.json({ store: {
        ...store,
        ...updatedStore,
    } })
}