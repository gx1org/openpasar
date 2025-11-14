import { db } from "../db.js";
import { Store } from "../schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { getConfig } from "../config.js";
export const hasStore = async (c, next) => {
    const userId = c.get('jwtPayload')?.id;
    const stores = await db.select().from(Store).where(eq(Store.user_id, userId));
    if (stores.length === 0) {
        return c.json({ message: 'Store not found' }, 404);
    }
    c.set('store', stores[0]);
    return next();
};
export const isAdmin = async (c, next) => {
    const admin_email = await getConfig('admin_email');
    const userEmail = c.get('jwtPayload')?.email;
    if (userEmail != admin_email) {
        return c.json({ message: 'Not admin' }, 403);
    }
    return next();
};
export const initialConfig = async (c, next) => {
    const installed = await getConfig('installed');
    if (installed == 'yes') {
        return c.json({ message: 'Already installed' }, 403);
    }
    return next();
};
