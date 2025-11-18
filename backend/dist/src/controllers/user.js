import { User } from "../schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { getConfig, setConfig } from "../config.js";
import { hashString } from "../utils/helper.js";
export const profile = async (c) => {
    const userId = c.get('jwtPayload')?.id;
    const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    return c.json({ user });
};
export const updateProfile = async (c) => {
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
    };
    await db.update(User)
        .set(updatedUser)
        .where(eq(User.id, payload.id));
    const adminEmail = await getConfig('admin_email');
    if (user.email == adminEmail && user.email !== email) {
        await setConfig('admin_email', email);
    }
    return c.json({
        user: { ...user, ...updatedUser }
    });
};
export const updatePin = async (c) => {
    const userId = c.get('jwtPayload').id;
    const { old_pin, new_pin } = await c.req.json();
    const [user] = await db.select().from(User).where(eq(User.id, userId)).limit(1);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    if (user.hashed_pin != '') {
        const hashedOldPin = await hashString(old_pin);
        if (user.hashed_pin !== hashedOldPin) {
            return c.json({ message: "Invalid old pin" }, 400);
        }
    }
    const hashedNewPin = await hashString(new_pin);
    await db.update(User)
        .set({
        hashed_pin: hashedNewPin,
    })
        .where(eq(User.id, user.id));
    return c.json({ message: "Success" });
};
