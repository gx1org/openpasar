import { db } from "../db.js";
import { Product } from "../schema.js";
import { and, desc, eq, ilike, or } from "drizzle-orm";
export const storeProductList = async (c) => {
    const store = c.get('store');
    const isActive = c.req.query('is_active') === '1';
    const search = c.req.query('search') || '';
    const products = await db.select()
        .from(Product)
        .where(and(eq(Product.store_id, store.id), eq(Product.is_active, isActive), search === '' ? undefined :
        or(ilike(Product.name, `%${search}%`), ilike(Product.sku, `%${search}%`))))
        .orderBy(desc(Product.created_at));
    return c.json({ products });
};
export const storeProductDetail = async (c) => {
    const store = c.get('store');
    const id = c.req.param('id');
    const [product] = await db.select().from(Product)
        .where(and(eq(Product.id, Number(id)), eq(Product.store_id, store.id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }
    return c.json({ product });
};
export const storeProductCreate = async (c) => {
    const { sku, name, description, price, in_stock, image_url } = await c.req.json();
    const store = c.get('store');
    const [check] = await db.select().from(Product).where(eq(Product.sku, sku)).limit(1);
    if (check) {
        return c.json({ message: "Product already exists" }, 400);
    }
    const [product] = await db.insert(Product).values({
        sku,
        name,
        description,
        price,
        in_stock,
        is_active: true,
        image_url,
        store_id: store.id,
    }).returning();
    return c.json({ product });
};
export const storeProductUpdate = async (c) => {
    const id = c.req.param('id');
    const store = c.get('store');
    const [product] = await db.select().from(Product)
        .where(and(eq(Product.id, Number(id)), eq(Product.store_id, store.id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }
    const { sku, name, description, price, in_stock, image_url } = await c.req.json();
    const updatedProduct = {
        sku,
        name,
        description,
        price,
        in_stock,
        image_url
    };
    await db.update(Product)
        .set(updatedProduct)
        .where(and(eq(Product.id, Number(id)), eq(Product.store_id, store.id)));
    return c.json({
        product: {
            ...product,
            ...updatedProduct
        }
    });
};
export const storeProductToggle = async (c) => {
    const { id } = c.req.param();
    const store = c.get('store');
    const [product] = await db.select().from(Product)
        .where(and(eq(Product.id, Number(id)), eq(Product.store_id, store.id)))
        .limit(1);
    if (!product) {
        return c.json({ message: "Product not found" }, 404);
    }
    await db.update(Product)
        .set({ is_active: !product.is_active })
        .where(and(eq(Product.id, Number(id)), eq(Product.store_id, store.id)));
    return c.json({ message: `Success` });
};
