import type { Context } from "hono";
import { db } from "../db.js";
import { Store } from "../schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { admin_email } from "../config.js";

export const hasStore = async (c: Context, next: () => Promise<void>) => {
    const userId = c.get('jwtPayload')?.id;
    const stores = await db.select().from(Store).where(eq(Store.user_id, userId));
    if (stores.length === 0) {
        return c.json({ message: 'Store not found' }, 404);
    }

    c.set('store', stores[0]);
    return next();
}

export const isAdmin = async (c: Context, next: () => Promise<void>) => {
    const userEmail = c.get('jwtPayload')?.email;
    if (userEmail != admin_email) {
        return c.json({ message: 'Not admin' }, 403);
    }

    return next()
}