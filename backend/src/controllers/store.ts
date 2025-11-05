import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const storeCreate = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({})
}

export const storeDetail = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({})
}

export const storeUpdate = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({})
}