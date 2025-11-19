import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db, runMigration } from "../db.js";
import { Config } from "../schema.js";

export const healthCheck = async (c: Context): Promise<HandlerResponse<any>> => {
  try {
    await db.select().from(Config).limit(1)
    return c.json({ message: 'OK' });
  } catch (error: any) {
    console.error(error)
    const cause = error?.cause?.toString()
    if (cause.includes('relation "configs" does not exist')) {
      if (await runMigration()) {
        return c.json({ message: 'OK' });
      }
      return c.json({ message: 'Cannot run database migrationn, please check the log' });
    }
    return c.json({ message: cause }, 500);
  }
}