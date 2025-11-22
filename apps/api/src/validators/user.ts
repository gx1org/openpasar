import z from "zod";

export const authSchema = z.object({
  auth_code: z.string().nonempty(),
});

export const cartSchema = z.object({
  sku: z.string().nonempty(),
});

export const checkoutSchema = z.object({
  store_id: z.coerce.number().int().min(1).nonoptional(),
  note: z.string().optional(),
})

export const catalogueSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['latest', 'lowest', 'highest', 'sell', 'featured']).optional().default('latest'),
  page: z.coerce.number().int().min(1).default(1),
});

export const configSchema = z.object({
  admin_email: z.email().nonempty(),
  admin_phone: z.string().nonempty().startsWith('+62'),
  site_mode: z.enum(['marketplace', 'official_store']),
  site_name: z.string().nonempty(),
  site_description: z.string().nonempty(),
  site_icon: z.url().nonempty(),
  site_theme: z.string().nonempty(),
  autzorg_app_id: z.string().nonempty(),
  pakasir_slug: z.string().nonempty(),
  pakasir_api_key: z.string().nonempty(),
  smtp_host: z.string().optional(),
  smtp_port: z.enum(['25', '465', '587', '']).optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_from: z.string().optional(),
  content_info: z.string().nonempty(),
  content_seller_rules: z.string().nonempty(),
  seller_fee: z.coerce.number().min(0).max(100).default(0).transform(String),
  cronjob_secret: z.string().nonempty(),
});

export const storeListSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['latest', 'sales']).optional().default('latest'),
  page: z.coerce.number().int().min(1).default(1),
});

export const storeCreateUpdateSchema = z.object({
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  phone: z.string().nonempty(),
  description: z.string().nonempty(),
})

export const transactionListSchema = z.object({
  search: z.string().optional(),
  status: z.enum([
    'pending',
    'in_process',
    'sent',
    'complained',
    'completed',
    'rejected',
    'canceled',
    '',
  ]).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const transactionStatusUpdateSchema = z.object({
  status: z.enum([
    'canceled',
    'complained',
    'completed'
  ]),
})

export const withdrawalListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
})

export const profileSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().nonempty(),
})

export const pinUpdateSchema = z.object({
  old_pin: z.string(),
  new_pin: z.string().nonempty().length(6),
})

export const webhookPakasirSchema = z.object({
  order_id: z.string().nonempty(),
  amount: z.number().int().min(1),
})

export const withdrawalCreateSchema = z.object({
  amount: z.number().int().min(1),
  receiver: z.string().nonempty(),
  pin: z.string().nonempty().length(6),
})
