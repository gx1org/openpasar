import { configCache, configKeys, getAllConfigs, getConfig, setConfig } from "../config.js";
export const getSiteConfig = async (c) => {
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
    };
    return c.json({ config });
};
export const getSiteConfigAll = async (c) => {
    const configs = await getAllConfigs();
    return c.json({ configs });
};
export const setSiteConfig = async (c) => {
    const body = await c.req.json();
    const configs = await getAllConfigs();
    for (const c of configKeys) {
        if (body[c] === undefined || body[c] === configs[c]) {
            continue;
        }
        await setConfig(c, body[c]);
    }
    configCache.loaded = 'no';
    if (configs['installed'] !== 'yes') {
        await setConfig('installed', 'yes');
    }
    return getSiteConfig(c);
};
