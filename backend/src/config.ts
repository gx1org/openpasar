import { getEnv } from "./env.js";

export const autzorg_app_id = getEnv('AUTZORG_APP_ID', '');
export const pakasir_slug = getEnv('PAKASIR_SLUG', '');
export const pakasir_api_key = getEnv('PAKASIR_API_KEY', '');
export const jwt_secret = getEnv('JWT_SECRET', 'default_secret');
export const database_url = getEnv('DATABASE_URL', '');
export const port = getEnv('PORT', '7100');
export const admin_email = getEnv('ADMIN_EMAIL', '');
export const site_name = getEnv('SITE_NAME', 'OpenPasar');
export const site_icon = getEnv('SITE_ICON', 'https://upld.zone.id/uploads/quay/openpasar.webp');
export const site_description = getEnv('SITE_DESCRIPTION', 'OpenPasar - Marketplace Platform');
export const site_mode = getEnv('SITE_MODE', 'marketplace');
export const site_theme = getEnv('SITE_THEME', 'default');
export const smtp_host = getEnv('SMTP_HOST', '');
export const smtp_port = getEnv('SMTP_PORT', '587');
export const smtp_user = getEnv('SMTP_USER', '');
export const smtp_pass = getEnv('SMTP_PASS', '');
export const smtp_from = getEnv('SMTP_FROM', '');
