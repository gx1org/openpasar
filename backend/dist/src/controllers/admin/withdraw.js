export const adminWithdrawalList = async (c) => {
    return c.json({ withdrawals: [] });
};
export const adminWithdrawalApproveReject = async (c) => {
    const { id } = c.req.param();
    const { action } = await c.req.json();
    return c.json({ message: `Withdrawal ${id} has been ${action}` });
};
