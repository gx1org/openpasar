import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Cart, Product, Store, Transaction } from "../schema.js";
import { and, desc, eq } from "drizzle-orm";
import { statusPending } from "../utils/constant.js";
import z from "zod";
import { parseError } from "../utils/helper.js";
import { cartSchema, checkoutSchema } from "../validators/user.js";

export const cartList = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const carts = await db.select({
    id: Cart.id,
    product_id: Cart.product_id,
    store_id: Cart.store_id,
    quantity: Cart.quantity,
    sku: Product.sku,
    name: Product.name,
    image_url: Product.image_url,
    description: Product.description,
    price: Product.price,
    store_sales_count: Store.sales_count,
    store_name: Store.name,
    store_phone: Store.phone
  })
    .from(Cart)
    .innerJoin(Product, eq(Cart.product_id, Product.id))
    .innerJoin(Store, eq(Cart.store_id, Store.id))
    .where(eq(Cart.user_id, userId))
    .orderBy(desc(Cart.created_at));

  return c.json({ carts });
}

export const addToCart = async (c: Context): Promise<HandlerResponse<any>> => {
  const valid = z.safeParse(cartSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const [product] = await db.select().from(Product).where(eq(Product.sku, req.sku)).limit(1);
  if (!product) {
    return c.json({ message: "Produk tidak ditemukan" }, 404);
  }
  if (product.in_stock == 'empty') {
    return c.json({ message: "Produk habis terjual" }, 400);
  }

  const userId = c.get('jwtPayload')?.id;
  const [exist] = await db.select().from(Cart)
    .where(and(eq(Cart.user_id, userId), eq(Cart.product_id, product.id)))
    .limit(1);
  if (exist) {
    const quantity = exist.quantity + 1;
    await db.update(Cart).set({ quantity })
      .where(eq(Cart.id, exist.id));
  } else {
    const cart = {
      user_id: userId,
      product_id: product.id,
      store_id: product.store_id,
      quantity: 1,
    };
    await db.insert(Cart).values(cart);
  }

  return cartList(c);
}

export const removeFromCart = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ message: "Invalid id" }, 400);
  }

  const [cart] = await db.select().from(Cart)
    .where(and(
      eq(Cart.user_id, userId),
      eq(Cart.id, id)
    ))
    .limit(1);
  if (!cart) {
    return c.json({ message: "Produk tidak di keranjang" }, 404);
  }
  if (cart.quantity === 1) {
    await db.delete(Cart).where(eq(Cart.id, cart.id));
  } else {
    await db.update(Cart).set({ quantity: cart.quantity - 1 })
      .where(eq(Cart.id, cart.id));
  }
  return cartList(c);
}

export const checkout = async (c: Context): Promise<HandlerResponse<any>> => {
  const userId = c.get('jwtPayload')?.id;
  const valid = z.safeParse(checkoutSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const carts = await db.select({
    id: Cart.id,
    product_id: Cart.product_id,
    store_id: Cart.store_id,
    quantity: Cart.quantity,
    sku: Product.sku,
    name: Product.name,
    in_stock: Product.in_stock,
    image_url: Product.image_url,
    description: Product.description,
    price: Product.price,
  })
    .from(Cart)
    .innerJoin(Product, eq(Cart.product_id, Product.id))
    .where(and(
      eq(Cart.user_id, userId),
      eq(Cart.store_id, req.store_id),
    ));
  if (carts.length === 0) {
    return c.json({ message: "Keranjang masih kosong" }, 400);
  }

  for (const cart of carts) {
    if (cart.in_stock == 'empty') {
      return c.json({ message: `Produk habis terjual (${cart.name})` }, 400);
    }
  }

  const transaction = {
    buyer_id: userId,
    store_id: req.store_id,
    checkout_note: req.note,
    total_amount: carts.reduce((total, cart) => total + cart.quantity * cart.price, 0),
    status: statusPending,
    items: carts.map((cart) => ({
      id: cart.product_id,
      quantity: cart.quantity,
      price: cart.price,
      name: cart.name,
      image_url: cart.image_url,
      description: cart.description,
      sku: cart.sku
    })),
    histories: [{
      status: statusPending,
      created_at: new Date(),
    }],
    description: carts.map((cart) => cart.name).join(", "),
  };

  await db.insert(Transaction).values(transaction).returning();
  await db.delete(Cart).where(and(
    eq(Cart.user_id, userId),
    eq(Cart.store_id, req.store_id),
  ));
  return c.json({ message: "Checkout successful" });
}