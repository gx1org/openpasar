import { getEnv } from "../env.js";
import { db } from "../db.js";
import { Store, User } from "../schema.js";
import { eq } from "drizzle-orm";
import { generateJwt } from "../utils/jwt.js";
import { getConfig } from "../config.js";
export const authorize = async (c) => {
    const { auth_code } = await c.req.json();
    const appId = await getConfig('autzorg_app_id');
    const res = await fetch(`https://autz.org/api/client/${appId}/userinfo?code=${auth_code}`);
    const data = await res.json();
    if (!res.ok) {
        return c.json({ message: data.message }, 400);
    }
    const users = await db.select().from(User).where(eq(User.autzorg_id, data.user.id));
    let isNewUser = false;
    if (users.length === 0) {
        const [newUser] = await db.insert(User).values({
            autzorg_id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
        }).returning();
        users.push(newUser);
        isNewUser = true;
    }
    const user = users[0];
    const token = await generateJwt(String(user.id), user.email);
    let store = {};
    if (!isNewUser) {
        [store] = await db.select().from(Store).where(eq(Store.user_id, user.id)).limit(1);
    }
    return c.json({ message: "Authorized", token, user, store });
};
export const refreshToken = async (c) => {
    const userId = c.get('jwtPayload')?.id;
    const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    const token = await generateJwt(String(userId), c.get('jwtPayload').email);
    const [store] = await db.select().from(Store).where(eq(Store.user_id, userId)).limit(1);
    return c.json({ message: "Authorized", token, user, store });
};
