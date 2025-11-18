import { User } from "../../schema.js";
import { db } from "../../db.js";
import { eq } from "drizzle-orm";
export const adminUserList = async (c) => {
    const users = await db.select().from(User);
    return c.json({ users });
};
export const adminUserDetail = async (c) => {
    const { id } = c.req.param();
    const users = await db.select().from(User).where(eq(User.id, Number(id)));
    if (users.length === 0) {
        return c.json({ message: "User not found" }, 404);
    }
    const user = users[0];
    return c.json({ user });
};
export const adminUserSuspendStatusUpdate = async (c) => {
    const { id } = c.req.param();
    const { suspend } = await c.req.json();
    const users = await db.select().from(User).where(eq(User.id, Number(id)));
    if (users.length === 0) {
        return c.json({ message: "User not found" }, 404);
    }
    // Misalnya kita simpan status suspend di kolom terpisah, tapi di sini hanya simulasi
    return c.json({ message: `User ${id} suspend status updated to ${suspend}` });
};
