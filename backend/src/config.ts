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

// export const autzorg_app_id = getEnv('AUTZORG_APP_ID', '');
// export const pakasir_slug = getEnv('PAKASIR_SLUG', '');
// export const pakasir_api_key = getEnv('PAKASIR_API_KEY', '');
// export const jwt_secret = getEnv('JWT_SECRET', 'default_secret');
// export const database_url = getEnv('DATABASE_URL', '');
// export const port = getEnv('PORT', '7100');
// export const admin_email = getEnv('ADMIN_EMAIL', '');
// export const site_name = getEnv('SITE_NAME', 'OpenPasar');
// export const site_icon = getEnv('SITE_ICON', 'https://upld.zone.id/uploads/quay/openpasar.webp');
// export const site_description = getEnv('SITE_DESCRIPTION', 'OpenPasar - Marketplace Platform');
// export const site_mode = getEnv('SITE_MODE', 'marketplace');
// export const site_theme = getEnv('SITE_THEME', 'default');
// export const smtp_host = getEnv('SMTP_HOST', '');
// export const smtp_port = getEnv('SMTP_PORT', '587');
// export const smtp_user = getEnv('SMTP_USER', '');
// export const smtp_pass = getEnv('SMTP_PASS', '');
// export const smtp_from = getEnv('SMTP_FROM', '');
