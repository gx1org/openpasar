import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { db } from "../../db.js";
import { Product, Store } from "../../schema.js";
import { and, desc, eq, gt, ilike, or } from "drizzle-orm";

export const adminProductList = async (c: Context): Promise<HandlerResponse<any>> => {
    const isActive = c.req.query('is_active') === '1';
    const search = c.req.query('search') || '';
    type sortType = 'latest' | 'sell' | 'featured'
    const sort = (c.req.query('sort') || 'latest') as sortType;
    const featuredQuery = sort === 'featured' ? gt(Product.featured, 0) : undefined;
    const orderByMap = {
        latest: desc(Product.created_at),
        sell: desc(Product.sold_count),
        featured: desc(Product.featured),
    };
    const orderBy = orderByMap[sort];

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
    const id = c.req.param('id');
    const [product] = await db.select().from(Product)
        .where(eq(Product.id, Number(id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }

    return c.json({ product });
}

export const adminProductToggle = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const [product] = await db.select().from(Product)
        .where(eq(Product.id, Number(id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }

    await db.update(Product)
        .set({ is_active: !product.is_active })
        .where(eq(Product.id, product.id));
    return c.json({ message: `Success` });
}

export const adminProductFeatured = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { featured } = await c.req.json();
    const [product] = await db.select().from(Product)
        .where(eq(Product.id, Number(id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }

    await db.update(Product)
        .set({ featured })
        .where(eq(Product.id, product.id));
    return c.json({ message: `Success` });
}
