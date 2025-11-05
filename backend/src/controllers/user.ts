import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";

export const profile = async (c: Context): Promise<HandlerResponse<any>> => {
    const payload = c.get('jwtPayload');
    const users = await db.select().from(User).where(eq(User.id, payload.id));
    if (users.length === 0) {
        return c.json({ message: "User not found" }, 404);
    }
    const user = users[0];
    return c.json({ user });
}

export const updateProfile = async (c: Context): Promise<HandlerResponse<any>> => {
    const payload = c.get('jwtPayload');
    const { name, phone } = await c.req.json();
    const users = await db.select().from(User).where(eq(User.id, payload.id));
    if (users.length === 0) {
        return c.json({ message: "User not found" }, 404);
    }
    const user = users[0];
    await db.update(User).set({
        name: name ?? user.name,
        phone: phone ?? user.phone,
    }).where(eq(User.id, payload.id));
    return c.json({ message: "Profile updated" });
}
