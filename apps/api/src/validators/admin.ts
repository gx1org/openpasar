import z from "zod";

export const productListSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1),
  is_active: z.enum(['0', '1', '']).optional().default(''),
  sort: z.enum(['latest', 'sell', 'name', 'featured']).optional().default('latest'),
  featured: z.enum(['0', '1', '']).optional().default(''),
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
  page: z.coerce.number().int().min(1).default(1),
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
  page: z.coerce.number().int().min(1).default(1),
})

export const storeListSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1),
})

export const withdrawalListSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1),
})

export const storeCreateUpdateSchema = z.object({
  user_id: z.number().int().min(1).nonoptional(),
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  phone: z.string().nonempty(),
  description: z.string().nonempty(),
})

export const adminProductCreateUpdateSchema = z.object({
  name: z.string().nonempty(),
  sku: z.string().nonempty(),
  price: z.number().int().min(1).nonoptional(),
  in_stock: z.enum(['one', 'many', 'empty']).nonoptional(),
  description: z.string().nonempty(),
  image_url: z.string().nonempty(),
  visibility: z.enum(['public', 'private', 'pending_review']).nonoptional(),
});
