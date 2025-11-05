import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const cartList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ cart: [] });
}

export const addToCart = async (c: Context): Promise<HandlerResponse<any>> => {
    const { productId, quantity } = await c.req.json();
    return c.json({ message: `Added product ${productId} with quantity ${quantity} to cart` });
}

export const removeFromCart = async (c: Context): Promise<HandlerResponse<any>> => {
    const { productId } = await c.req.json();
    return c.json({ message: `Removed product ${productId} from cart` });
}

export const checkout = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ message: "Checkout successful" });
}