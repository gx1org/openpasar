import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../db.js";
import { Product, Store } from "../schema.js";
import { and, asc, desc, eq, gt, ilike } from "drizzle-orm";

export const catalogueList = async (c: Context): Promise<HandlerResponse<any>> => {
    const page = parseInt(c.req.query('page') || '1');
    const q = c.req.query('q') || '';
    type sortType = 'latest' | 'lowest' | 'highest' | 'sell' | 'featured'
    const sort = (c.req.query('sort') || 'latest') as sortType;
    const limit = 10;
    const offset = (page - 1) * limit;

    const searchQuery = q ? ilike(Product.name, `%${q}%`) : undefined;
    const featuredQuery = sort === 'featured' ? gt(Product.featured, 0) : undefined;
    const orderByMap = {
        latest: desc(Product.created_at),
        lowest: asc(Product.price),
        highest: desc(Product.price),
        sell: desc(Product.sold_count),
        featured: desc(Product.featured),
    };
    const orderBy = orderByMap[sort];

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
        eq(Product.is_active, true),
        searchQuery,
        featuredQuery,
    ))
    .orderBy(orderBy, orderByMap['latest'], asc(eq(Product.in_stock, 'empty')))
    .limit(limit)
    .offset(offset);

    return c.json({ products });
}

export const catalogueDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { sku } = c.req.param();
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
        return c.json({ message: "Product not found", product: {} }, 404);
    }
    return c.json({ product: products[0] });
}