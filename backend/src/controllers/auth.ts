import type { Context } from "hono";
import { getEnv } from "../env.js";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { User } from "../schema.js";
import { eq } from "drizzle-orm";
import { generateJwt } from "../utils/jwt.js";
import { getConfig } from "../config.js";

export const authorize = async (c: Context): Promise<HandlerResponse<any>> => {
    const { auth_code } = await c.req.json();
    const appId = await getConfig('autzorg_app_id');
    const res = await fetch(`https://autz.org/api/client/${appId}/userinfo?code=${auth_code}`)
    const data = await res.json()
    if (!res.ok) {
        return c.json({ message: data.message }, 400);
    }

    const users = await db.select().from(User).where(eq(User.autzorg_id, data.user.id));
    if (users.length === 0) {
        const [newUser] = await db.insert(User).values({
            autzorg_id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
        }).returning();
        users.push(newUser);
    }
    
    const user = users[0];
    const token = await generateJwt(String(user.id), user.email);
    return c.json({ message: "Authorized", token, user });
}

export const refreshToken = async (c: Context): Promise<HandlerResponse<any>> => {
    const userId = c.get('jwtPayload')?.id;
    const token = await generateJwt(String(userId), c.get('jwtPayload').email);
    const users = await db.select().from(User).where(eq(User.id, userId));
    return c.json({ message: "Authorized", token, user: users[0] });
}