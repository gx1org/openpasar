import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";
import { User, Withdrawal } from "../../schema.js";
import { db } from "../../db.js";
import { desc, eq, sql } from "drizzle-orm";
import { withdrawalApproveRejectSchema } from "../../validators/admin.js";
import z from "zod";
import { parseError } from "../../utils/helper.js";
import { sendEmail } from "../../utils/email.js";

export const adminWithdrawalList = async (c: Context): Promise<HandlerResponse<any>> => {
  const withdrawals = await db.select().from(Withdrawal)
    .orderBy(
      desc(eq(Withdrawal.status, 'in_process')),
      desc(Withdrawal.created_at)
    );
  return c.json({ withdrawals });
}

export const adminWithdrawalApproveReject = async (c: Context): Promise<HandlerResponse<any>> => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ message: "Withdrawal tidak ditemukan" }, 404);
  }

  const valid = z.safeParse(withdrawalApproveRejectSchema, await c.req.json());
  if (!valid.success) {
    return c.json({ message: parseError(valid.error) }, 400);
  }

  const req = valid.data;
  const status = req.status
  const [withdrawal] = await db.select({
    id: Withdrawal.id,
    user_id: Withdrawal.user_id,
    amount: Withdrawal.amount,
    receiver: Withdrawal.receiver,
    status: Withdrawal.status,
    created_at: Withdrawal.created_at,
    user: {
      id: User.id,
      name: User.name,
      email: User.email,
    },
  }).from(Withdrawal)
    .innerJoin(User, eq(Withdrawal.user_id, User.id))
    .where(eq(Withdrawal.id, id))
    .limit(1);
  if (!withdrawal) {
    return c.json({ message: "Withdrawal tidak ditemukan" }, 404);
  }

  await db.update(Withdrawal)
    .set({ status })
    .where(eq(Withdrawal.id, id));

  if (status === 'rejected') {
    await db.update(User)
      .set({ balance: sql`${User.balance} + ${withdrawal.amount}` })
      .where(eq(User.id, withdrawal.user_id));

    sendEmail(
      withdrawal.user.email,
      `Penarikan telah ditolak admin`,
      `Hai ${withdrawal.user.name},
                    
Pesanan kamu sebesar Rp ${withdrawal.amount} telah ditolak oleh admin.
      
Silahkan login ke dashboard untuk melihat detail penarikan.`)
  }
  if (status === 'approved') {
    sendEmail(
      withdrawal.user.email,
      `Penarikan telah disetujui admin`,
      `Hai ${withdrawal.user.name},
                    
Pesanan kamu sebesar Rp ${withdrawal.amount} telah disetujui oleh admin.

Silakan periksa saldo di rekening/e-wallet Anda.`)
  }
  return c.json({ message: `Withdrawal ${id} has been ${status}` });
}
