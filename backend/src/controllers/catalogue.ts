import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product, Store } from "../schema.js";
import { eq } from "drizzle-orm";

export const catalogueList = async (c: Context): Promise<HandlerResponse<any>> => {
    const products = await db.select({
        sku: Product.sku,
        name: Product.name,
        description: Product.description,
        image_url: Product.image_url,
        price: Product.price,
        in_stock: Product.in_stock,
        store_name: Store.name,
        store_id: Store.id,
    }).from(Product)
        .innerJoin(Store, eq(Store.id, Product.store_id))
        .where(eq(Product.is_active, 1));
    return c.json({ products });
}

export const catalogueDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ product: { id } });
}