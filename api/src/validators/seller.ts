import z from "zod";
import { parseError } from "../utils/helper.js";

export const productListSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1).transform(String),
  is_active: z.enum(['0', '1']).nonoptional(),
});

export const productCreateUpdateSchema = z.object({
  name: z.string().nonempty(),
  sku: z.string().nonempty(),
  price: z.number().int().min(1).nonoptional(),
  in_stock: z.enum(['one', 'many', 'empty']).nonoptional(),
  description: z.string().nonempty(),
  image_url: z.string().nonempty(),
});

export const transactionListSchema = z.object({
  search: z.string().optional(),
  status: z.enum([
    'in_process',
    'sent',
    'complained',
    'completed',
    'rejected',
    'canceled',
    '',
  ]).optional(),
  page: z.coerce.number().int().min(1).default(1).transform(String),
});

export const transactionStatusUpdateSchema = z.object({
  status: z.enum([
    'sent',
    'rejected',
  ]),
  note: z.string().nonempty(),
})
