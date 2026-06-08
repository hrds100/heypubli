// Payout clearing rules (PIX model).
//
// An influencer's commission on a sale becomes payout-eligible ("cleared") only once the
// refund window has closed, so we never pay on a sale that later gets refunded. A sale
// clears when it's confirmed, not already in a payout, AND either Hotmart has sent the
// PURCHASE_COMPLETE event (authoritative "no more refunds") or 21 days have passed since
// the sale — matching the "21 dias após a venda confirmada" we already promise influencers.

export const PAYOUT_HOLD_DAYS = 21;

const HOLD_MS = PAYOUT_HOLD_DAYS * 24 * 60 * 60 * 1000;

export interface ClearableSale {
  status: string;
  payout_id: string | null;
  purchase_complete_at: string | null;
  sold_at: string;
}

/** Is this sale's commission cleared (safe to request/pay)? `now` injectable for tests. */
export function isSaleCleared(sale: ClearableSale, now: number = Date.now()): boolean {
  if (sale.status !== "confirmed") return false;
  if (sale.payout_id) return false; // already in a payout
  if (sale.purchase_complete_at) return true; // Hotmart confirmed the window closed
  return new Date(sale.sold_at).getTime() <= now - HOLD_MS;
}

/** Sum the cleared commission across an influencer's sales. */
export function availableBalance(
  sales: (ClearableSale & { commission_amount: number })[],
  now: number = Date.now(),
): { amount: number; saleIds: string[]; count: number } {
  const cleared = sales.filter((s) => isSaleCleared(s, now));
  const amount = cleared.reduce((sum, s) => sum + Number(s.commission_amount), 0);
  return {
    amount: Math.round(amount * 100) / 100,
    saleIds: cleared.map((s) => (s as { id?: string }).id ?? ""),
    count: cleared.length,
  };
}
