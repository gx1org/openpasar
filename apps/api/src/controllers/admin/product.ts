import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../../db.js";
import { Product, Store } from "../../schema.js";
import { and, desc, eq, gt, ilike, or } from "drizzle-orm";
import { productFeaturedSchema, productListSchema } from "../../validators/admin.js";
import z from "zod";
import { parseError } from "../../utils/helper.js";

export const adminProductList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(productListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const isActive = req.is_active === '1';
  const search = req.search || '';
  const featuredQuery = req.sort === 'featured' ? gt(Product.featured, 0) : undefined;
  const orderByMap = {
    latest: desc(Product.created_at),
    sell: desc(Product.sold_count),
    featured: desc(Product.featured),
  };
  const orderBy = orderByMap[req.sort as keyof typeof orderByMap];

  const products = await db.select({
    id: Product.id,
    name: Product.name,
    sku: Product.sku,
    image_url: Product.image_url,
    price: Product.price,
    in_stock: Product.in_stock,
    is_active: Product.is_active,
    created_at: Product.created_at,
    featured: Product.featured,
    store: {
      id: Store.id,
      name: Store.name
    }
  })
    .from(Product)
    .innerJoin(Store, eq(Store.id, Product.store_id))
    .where(and(
      eq(Product.is_active, isActive),
      search === '' ? undefined :
        or(
          ilike(Product.name, `%${search}%`),
          ilike(Product.sku, `%${search}%`)
        ),
      featuredQuery
    ))
    .orderBy(orderBy, orderByMap['latest']);
  return c.json({ products });
}

export const adminProductDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Produk tidak ditemukan" }, 400);
  }

  const [product] = await db.select().from(Product)
    .where(eq(Product.id, id))
    .limit(1);
  if (!product) {
    return c.json({ message: "Produk tidak ditemukan" }, 404);
  }

  return c.json({ product });
}

export const adminProductToggle = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Produk tidak ditemukan" }, 400);
  }

  const [product] = await db.select().from(Product)
    .where(eq(Product.id, id))
    .limit(1);
  if (!product) {
    return c.json({ message: "Produk tidak ditemukan" }, 404);
  }

  await db.update(Product)
    .set({ is_active: !product.is_active })
    .where(eq(Product.id, product.id));
  return c.json({ message: `Success` });
}

export const adminProductFeatured = async (c: Context): Promise<HandlerResponse<any>> => {
    const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Produk tidak ditemukan" }, 400);
  }

  const valid = z.safeParse(productFeaturedSchema, c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const [product] = await db.select().from(Product)
    .where(eq(Product.id, id))
    .limit(1);
  if (!product) {
    return c.json({ message: "Product not found" }, 404);
  }

  await db.update(Product)
    .set({ featured: req.featured })
    .where(eq(Product.id, product.id));
  return c.json({ message: `Success` });
}
