import type { Context } from "hono";
import { configCache, configKeys, getAllConfigs, getConfig, setConfig } from "../config.js";
import type { HandlerResponse } from "hono/types";
import { sendEmail } from "../utils/email.js";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { configSchema } from "../validators/user.js";

export const getSiteConfig = async (c: Context): Promise<HandlerResponse<any>> => {
  const {
    installed,
    site_name,
    site_icon,
    site_description,
    site_mode,
    site_theme,
    autzorg_app_id,
    pakasir_slug,
    admin_phone,
    content_info,
    content_seller_rules,
    seller_fee
  } = await getAllConfigs()

  const config = {
    installed,
    site_name,
    site_icon,
    site_description,
    site_mode,
    site_theme,
    autzorg_app_id,
    pakasir_slug,
    admin_phone,
    content_info,
    content_seller_rules,
    seller_fee
  }
  return c.json({ config });
}

export const getSiteConfigAll = async (c: Context): Promise<HandlerResponse<any>> => {
  const configs = await getAllConfigs()
  return c.json({ configs });
}

interface ReqType {
  [key: string]: any;
}

export const setSiteConfig = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(configSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req: ReqType = valid.data
  const configs = await getAllConfigs()
  for (const c of configKeys) {
    const key = c as keyof typeof configs
    if (req[key] === undefined || req[key] === configs[key]) {
      continue
    }
    await setConfig(c, req[key])
  }

  configCache.loaded = 'no'
  if (configs['installed'] !== 'yes') {
    await setConfig('installed', 'yes')
  }
  return getSiteConfig(c)
}

export const clearSiteConfigCache = async (c: Context): Promise<HandlerResponse<any>> => {
  configCache.loaded = 'no'
  return c.json({ message: 'Config cache cleared' })
}