import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const storeProductList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ products: [] });
}

export const storeProductDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ product: { id } });
}

export const storeProductCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { name, price } = await c.req.json();
    return c.json({ message: `Product ${name} with price ${price} created` });
}

export const storeProductUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { name, price } = await c.req.json();
    return c.json({ message: `Product ${id} updated to name ${name} with price ${price}` });
}

export const storeProductDelete = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ message: `Product ${id} deleted` });
}
