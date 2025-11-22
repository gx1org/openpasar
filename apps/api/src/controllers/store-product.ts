import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product } from "../schema.js";
import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { productCreateUpdateSchema, productListSchema } from "../validators/seller.js";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { sendEmail } from "../utils/email.js";
import { getConfig } from "../config.js";

export const storeProductList = async (c: Context): Promise<HandlerResponse<any>> => {
  const store = c.get('store');
  const valid = z.safeParse(productListSchema, c.req.query());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const isActive = req.is_active === '1';
  const where = and(
    eq(Product.store_id, store.id),
    eq(Product.is_active, isActive),
    req.search === '' ? undefined :
      or(
        ilike(Product.name, `%${req.search}%`),
        ilike(Product.sku, `%${req.search}%`)
      )
  )
  const limit = 10;
  const offset = (req.page - 1) * limit;

  const total = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(Product)
    .where(where)

  const products = await db.select()
    .from(Product)
    .where(where)
    .orderBy(desc(Product.created_at))
    .limit(limit)
    .offset(offset);

  return c.json({ products, total: Number(total[0].count) });
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
  const valid = z.safeParse(productCreateUpdateSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
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
    visibility: req.visibility == 'public' ? 'pending_review' : req.visibility,
    store_id: store.id,
  }).returning()

  if (req.visibility == 'public') {
    const adminEmail = await getConfig('admin_email')
    sendEmail(
      adminEmail,
      'Pengajuan Produk Baru',
      `Ada pengajuan Produk baru dengan nama: ${product.name} dan id: ${product.id}`
    )
  }

  return c.json({ product });
}

export const storeProductUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: 'Produk tidak ditemukan' }, 404);
  }

  const valid = z.safeParse(productCreateUpdateSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
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

  const isChangedToPublic = product.visibility != 'public' && req.visibility == 'public'

  await db.update(Product)
    .set({
      name: req.name,
      sku: req.sku,
      price: req.price,
      in_stock: req.in_stock,
      description: req.description,
      image_url: req.image_url,
      visibility: isChangedToPublic ? 'pending_review' : req.visibility,
    })
    .where(eq(Product.id, id));

  if (isChangedToPublic) {
    const adminEmail = await getConfig('admin_email')
    sendEmail(
      adminEmail,
      'Pengubahan Produk dari privat ke publik',
      `Ada Pengubahan Produk dari privat ke publik dengan nama: ${product.name} dan id: ${product.id}`
    )
  }

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
