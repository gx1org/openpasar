import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../../db.js";
import { Product, Store } from "../../schema.js";
import { and, asc, desc, eq, gt, ilike, ne, or, sql } from "drizzle-orm";
import { productFeaturedSchema, productListSchema } from "../../validators/admin.js";
import z from "zod";
import { parseError } from "../../utils/helper.js";
import { adminProductCreateUpdateSchema } from "../../validators/admin.js";

export const adminProductList = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(productListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const activeQuery = req.is_active ? eq(Product.is_active, req.is_active === '1') : undefined;
  const search = req.search || '';
  const featuredQuery = req.featured === '1' ? gt(Product.featured, 0) : (req.featured === '0' ? eq(Product.featured, 0) : undefined);
  const orderByMap = {
    latest: desc(Product.created_at),
    sell: desc(Product.sold_count),
    featured: desc(Product.featured),
    name: asc(Product.name),
  };
  const orderBy = orderByMap[req.sort as keyof typeof orderByMap];

  const limit = 10;
  const offset = (req.page - 1) * limit;

  const where = and(
    activeQuery,
    search === '' ? undefined :
      or(
        ilike(Product.name, `%${search}%`),
        ilike(Product.sku, `%${search}%`)
      ),
    featuredQuery
  );

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Product)
    .where(where)

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
    sold_count: Product.sold_count,
    description: Product.description,
    visibility: Product.visibility,
    store: {
      id: Store.id,
      name: Store.name
    }
  })
    .from(Product)
    .innerJoin(Store, eq(Store.id, Product.store_id))
    .where(where)
    .orderBy(orderBy, orderByMap['latest'])
    .limit(limit)
    .offset(offset);

  return c.json({ products, total: Number(total[0].count) });
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

  const valid = z.safeParse(productFeaturedSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const [product] = await db.select().from(Product)
    .where(eq(Product.id, id))
    .limit(1);
  if (!product) {
    return c.json({ message: "Produk tidak ditemukan" }, 404);
  }

  await db.update(Product)
    .set({ featured: req.featured })
    .where(eq(Product.id, product.id));
  return c.json({ message: `Success` });
}

export const adminProductPublish = async (c: Context): Promise<HandlerResponse<any>> => {
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
    .set({ visibility: product.visibility.replace('pending_review-', '') })
    .where(eq(Product.id, product.id));
  return c.json({ message: `Success` });
}

export const adminProductUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  const valid = z.safeParse(adminProductCreateUpdateSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const [product] = await db.select().from(Product)
    .where(and(
      eq(Product.id, id),
    ))
    .limit(1);
  if (!product) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  if (req.sku !== product.sku) {
    const [check] = await db.select().from(Product)
      .where(and(
        eq(Product.sku, req.sku),
        ne(Product.id, id)
      ))
      .limit(1);
    if (check) {
      return c.json({ message: `Produk dengan sku: ${req.sku} sudah ada` }, 400);
    }
  }

  await db.update(Product)
    .set({
      name: req.name,
      sku: req.sku,
      price: req.price,
      in_stock: req.in_stock,
      description: req.description,
      image_url: req.image_url,
      visibility: req.visibility,
    })
    .where(eq(Product.id, id));
  return c.json({
    product: {
      ...product,
      ...req
    }
  });
}
