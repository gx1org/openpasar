import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig, setConfig } from "../config.js";

export const profile = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    return c.json({ user });
}

export const updateProfile = async (c: Context): Promise<HandlerResponse<any>> => {
    const payload = c.get('jwtPayload');
    const { name, phone, email } = await c.req.json();
    const [user] = await db.select().from(User).where(eq(User.id, payload.id)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }

    const [check] = await db.select().from(User).where(eq(User.email, email)).limit(1);
    if (check) {
        return c.json({ message: "Email already exists" }, 400);
    }

    const updatedUser = {
        name,
        phone,
        email,
    }

    await db.update(User)
    .set(updatedUser)
    .where(eq(User.id, payload.id));

    const adminEmail = await getConfig('admin_email');
    if (user.email == adminEmail && user.email !== email) {
        await setConfig('admin_email', email)
    }

    return c.json({
        user: { ...user, ...updatedUser }
    });
}
