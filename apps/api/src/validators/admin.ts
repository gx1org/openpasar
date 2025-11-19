import z from "zod";

export const productListSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1).transform(String),
  is_active: z.enum(['0', '1', '']).optional().default(''),
  sort: z.enum(['latest', 'sell', 'featured']).optional().default('latest'),
})

export const productFeaturedSchema = z.object({
  featured: z.number().int().min(0).max(10).nonoptional(),
})

export const transactionListSchema = z.object({
  search: z.string().optional().default(''),
  status: z.enum([
    'in_process',
    'sent',
    'complained',
    'completed',
    'rejected',
    'canceled',
    '',
  ]).optional().default(''),
  page: z.coerce.number().int().min(1).default(1).transform(String),
});

export const transactionStatusUpdateSchema = z.object({
  status: z.enum([
    'completed',
    'canceled',
  ]),
  note: z.string().nonempty(),
})

export const withdrawalApproveRejectSchema = z.object({
  status: z.enum([
    'approved',
    'rejected',
  ]),
  note: z.string().nonempty(),
})

export const userListSchema = z.object({
  search: z.string().optional().default(''),
})

export const storeListSchema = z.object({
  search: z.string().optional().default(''),
})

export const storeCreateUpdateSchema = z.object({
  user_id: z.number().int().min(1).nonoptional(),
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  phone: z.string().nonempty(),
  description: z.string().nonempty(),
})
