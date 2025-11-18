import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { getEnv } from "./env.js";
import { Config } from "./schema.js";

export const configKeys = [
  'admin_email',
  'admin_phone',
  'site_mode',
  'site_name',
  'site_description',
  'site_icon',
  'site_theme',
  'autzorg_app_id',
  'pakasir_slug',
  'pakasir_api_key',
  'smtp_host',
  'smtp_port',
  'smtp_user',
  'smtp_password',
  'smtp_from',
  'content_info',
  'content_seller_rules',
  'seller_fee',
  'cronjob_secret',
]

export const configCache: Record<string, string | undefined> = {
  loaded: 'no'
}

export const getConfig = async (key: string): Promise<string> => {
  if (configCache.loaded == 'no') {
      const getFromDB = await db.select().from(Config)
      for (const c of getFromDB) {
          configCache[c.config_key] = c.value
      }
      configCache.loaded = 'yes'
  }

  return configCache[key] ?? ''
}

export const setConfig = async (key: string, value: string) => {
  await db.insert(Config)
  .values({
  config_key: key,
  value,
  })
  .onConflictDoUpdate({
  target: Config.config_key,
  set: {
    value,
  },
  });
  configCache[key] = value
}

export const getAllConfigs = async (): Promise<Record<string, string | undefined>> => {
   await getConfig('site_name')
   return configCache 
}
