import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

export const adminWithdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
    return c.json({ withdrawals: [] });
}

export const adminWithdrawalApproveReject = async (c: Context): Promise<HandlerResponse<any>> => {
    const { id } = c.req.param();
    const { action } = await c.req.json();
    return c.json({ message: `Withdrawal ${id} has been ${action}` });
}
