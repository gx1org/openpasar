import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db, runMigration } from "../db.js";
import { Config } from "../schema.js";

export const healthCheck = async (c: Context): Promise<HandlerResponse<any>> => {
  if (await runMigration()) {
    return c.json({ message: 'OK' });
  }
  return c.json({ message: 'Cannot run database migration, please check the log' }, 500);
}