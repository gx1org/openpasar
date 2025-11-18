import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db, runMigration } from "../db.js";
import { Config } from "../schema.js";

export const healthCheck = async (c: Context): Promise<HandlerResponse<any>> => {
  try {
    await db.select().from(Config).limit(1)
  } catch (error: any) {
    console.error(error)
    const cause = error?.cause?.toString()
    if (cause.includes('relation "configs" does not exist')) {
      await runMigration()
      return c.json({ message: 'Reload the page. If this message does not disappear, please check the log' });
    }

    return c.json({ message: cause }, 500);
  }
  return c.json({ message: 'OK' });
}