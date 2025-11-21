import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product, Store } from "../schema.js";
import { and, asc, desc, eq, gt, ilike, sql } from "drizzle-orm";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { catalogueSchema } from "../validators/user.js";

export const catalogueList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(catalogueSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const searchQuery = req.search ? ilike(Product.name, `%${req.search}%`) : undefined;
  const featuredQuery = req.sort === 'featured' ? gt(Product.featured, 0) : undefined;
  const where = and(
    eq(Product.is_active, true),
    eq(Product.visibility, 'public'),
    searchQuery,
    featuredQuery,
  )

  const orderByMap = {
    latest: desc(Product.created_at),
    lowest: asc(Product.price),
    highest: desc(Product.price),
    sell: desc(Product.sold_count),
    featured: desc(Product.featured),
  };
  const orderBy = orderByMap[req.sort as keyof typeof orderByMap];
  const limit = req.sort === 'featured' ? 100 : 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Product)
    .where(where)

  const products = await db.select({
    sku: Product.sku,
    name: Product.name,
    description: Product.description,
    image_url: Product.image_url,
    price: Product.price,
    in_stock: Product.in_stock,
    store_name: Store.name,
    store_sales_count: Store.sales_count,
    store_id: Store.id,
    store_phone: Store.phone,
  })
    .from(Product)
    .innerJoin(Store, eq(Store.id, Product.store_id))
    .where(where)
    .orderBy(orderBy, orderByMap['latest'], asc(eq(Product.in_stock, 'empty')))
    .limit(limit)
    .offset(offset);

  return c.json({ products, total: total[0].count });
}

export const catalogueDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const sku = c.req.param('sku');
  if (!sku) {
    return c.json({ message: "Produk tidak ditemukan", product: {} }, 404);
  }

  const products = await db.select({
    sku: Product.sku,
    name: Product.name,
    description: Product.description,
    image_url: Product.image_url,
    price: Product.price,
    in_stock: Product.in_stock,
    store_name: Store.name,
    store_sales_count: Store.sales_count,
    store_id: Store.id,
    store_phone: Store.phone,
  })
    .from(Product)
    .innerJoin(Store, eq(Store.id, Product.store_id))
    .where(and(
      eq(Product.sku, sku),
      eq(Product.is_active, true),
    ))
    .limit(1);
  if (products.length === 0) {
    return c.json({ message: "Produk tidak ditemukan", product: {} }, 404);
  }
  return c.json({ product: products[0] });
}