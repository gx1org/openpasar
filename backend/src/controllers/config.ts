import type { Context } from "hono";
import { autzorg_app_id, pakasir_slug, site_description, site_icon, site_mode, site_name, site_theme } from "../config.js";
import type { HandlerResponse } from "hono/types";

export const getConfig = async (c: Context): Promise<HandlerResponse<any>> => {
    const config = {
        site_name: site_name,
        site_icon: site_icon,
        site_description: site_description,
        site_mode: site_mode,
        site_theme: site_theme,
        autzorg_app_id: autzorg_app_id,
        pakasir_slug: pakasir_slug,
    }
    return c.json({ config });
}