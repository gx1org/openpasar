import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { and, desc, eq, ilike, ne } from "drizzle-orm";

export const storeList = async (c: Context): Promise<HandlerResponse<any>> => {
    const page = parseInt(c.req.query('page') || '1');
    const q = c.req.query('q') || '';
    type sortType = 'latest' | 'sales'
    const sort = (c.req.query('sort') || 'latest') as sortType;
    const limit = 10;
    const offset = (page - 1) * limit;

    const searchQuery = q ? ilike(Store.name, `%${q}%`) : undefined;
    const orderByMap = {
        latest: desc(Store.created_at),
        sales: desc(Store.sales_count),
    };
    const orderBy = orderByMap[sort];

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
        phone: body.phone,
        description: body.description,
    }).returning()
    return c.json({ store });
}


export const storeUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const store = c.get('store');
    const body = await c.req.json();
    const updatedStore = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        description: body.description,
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

export const storeDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const stores = await db.select().from(Store).where(eq(Store.id, Number(id)));
    if (stores.length === 0) {
        return c.json({ message: "Store not found" }, 404);
    }
    const store = stores[0];
    return c.json({ store });
}
