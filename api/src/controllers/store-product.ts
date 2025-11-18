import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product } from "../schema.js";
import { and, desc, eq, ilike, ne, or } from "drizzle-orm";
import { productCreateUpdateSchema, productListSchema } from "../validators/seller.js";
import z from "zod";
import { parseError } from "../utils/helper.js";

export const storeProductList = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const valid = z.safeParse(productListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const isActive = req.is_active === '1';
  const products = await db.select()
    .from(Product)
    .where(and(
      eq(Product.store_id, store.id),
      eq(Product.is_active, isActive),
      req.search === '' ? undefined :
        or(
          ilike(Product.name, `%${req.search}%`),
          ilike(Product.sku, `%${req.search}%`)
        )
    ))
    .orderBy(desc(Product.created_at));
  return c.json({ products });
}

export const storeProductDetail = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  const [product] = await db.select().from(Product)
    .where(and(
      eq(Product.id, id),
      eq(Product.store_id, store.id)
    ))
    .limit(1);
  if (!product) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  return c.json({ product });
}

export const storeProductCreate = async (c: Context): Promise<HandlerResponse<any>> => {
  const req = await c.req.json();
  const valid = z.safeParse(productCreateUpdateSchema, req);
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const store = c.get('store');
  const [check] = await db.select().from(Product)
    .where(eq(Product.sku, req.sku))
    .limit(1);
  if (check) {
    return c.json({ message: `Produk dengan sku: ${req.sku} sudah ada` }, 400);
  }

  const [product] = await db.insert(Product).values({
    name: req.name,
    sku: req.sku,
    price: req.price,
    in_stock: req.in_stock,
    description: req.description,
    image_url: req.image_url,
    is_active: true,
    store_id: store.id,
  }).returning()

  return c.json({ product });
}

export const storeProductUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  const req = await c.req.json();
  const valid = z.safeParse(productCreateUpdateSchema, req);
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const store = c.get('store');
  const [product] = await db.select().from(Product)
    .where(and(
      eq(Product.id, id),
      eq(Product.store_id, store.id)
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
    })
    .where(eq(Product.id, id));
  return c.json({
    product: {
      ...product,
      ...req
    }
  });
}

export const storeProductToggle = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  const store = c.get('store');
  const [product] = await db.select().from(Product)
    .where(and(eq(Product.id, id), eq(Product.store_id, store.id)))
    .limit(1);
  if (!product) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  await db.update(Product)
    .set({ is_active: !product.is_active })
    .where(eq(Product.id, id));
  return c.json({ message: `Success` });
}
