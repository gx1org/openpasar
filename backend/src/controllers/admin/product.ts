import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const adminProductList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ products: [] });
}

export const adminProductDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ product: { id } });
}

export const adminProductUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { name, price } = await c.req.json();
    return c.json({ message: `Product ${id} updated to name ${name} with price ${price}` });
}

export const adminProductDelete = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    return c.json({ message: `Product ${id} deleted` });
}
