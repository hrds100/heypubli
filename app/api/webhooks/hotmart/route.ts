import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractSck, computeCommission } from "@/lib/integrations/hotmart";
import type { SaleStatus } from "@/types/database";

export async function POST(request: Request) {
  const body = await request.json();

  const hottok = body.hottok as string | undefined;
  const expectedHottok = process.env.HOTMART_HOTTOK;
  if (expectedHottok) {
    if (
      !hottok ||
      hottok.length !== expectedHottok.length ||
      !crypto.timingSafeEqual(Buffer.from(hottok), Buffer.from(expectedHottok))
    ) {
      return NextResponse.json({ error: "Invalid hottok" }, { status: 401 });
    }
  }

  const event = body.event as string | undefined;
  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const data = body.data;
  if (!data) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  switch (event) {
    case "PURCHASE_APPROVED":
      await handlePurchase(data, "confirmed", false);
      break;
    case "PURCHASE_COMPLETE":
      // Refund window closed → mark the sale as cleared for payout.
      await handlePurchase(data, "confirmed", true);
      break;
    case "PURCHASE_REFUNDED":
      await handleStatusUpdate(data, "refunded");
      break;
    case "PURCHASE_CANCELED":
    case "PURCHASE_CHARGEBACK":
      await handleStatusUpdate(data, "cancelled");
      break;
    default:
      console.log("[hotmart-webhook] unhandled event:", event);
  }

  return NextResponse.json({ received: true });
}

async function handlePurchase(
  data: Record<string, unknown>,
  status: SaleStatus,
  markComplete: boolean,
) {
  const purchase = data.purchase as Record<string, unknown> | undefined;
  const product = data.product as Record<string, unknown> | undefined;
  const buyer = data.buyer as Record<string, unknown> | undefined;

  const transactionId = purchase?.transaction as string | undefined;
  if (!transactionId) return;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("hotmart_sales")
    .select("id")
    .eq("transaction_id", transactionId)
    .single();

  if (existing) {
    // PURCHASE_COMPLETE for a sale we already recorded → stamp the refund window closed.
    if (markComplete) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("hotmart_sales") as any)
        .update({ purchase_complete_at: new Date().toISOString() })
        .eq("transaction_id", transactionId)
        .eq("status", "confirmed"); // don't "clear" a refunded/cancelled sale
    }
    return;
  }

  const affiliates = data.affiliates as Array<Record<string, unknown>> | undefined;

  // PIX model: the influencer's referral_tag rides along as Hotmart's `sck`.
  const sck = extractSck(data)?.toLowerCase() ?? null;
  const affiliateCode = (affiliates?.[0]?.affiliate_code as string) ?? null;

  const profile = await matchSaleToProfile(
    supabase,
    sck,
    affiliateCode,
    buyer?.email as string | undefined,
  );

  if (!profile) {
    console.log(
      "[hotmart-webhook] no matching influencer for affiliate:",
      affiliateCode,
      "buyer:",
      buyer?.email,
    );
    return;
  }

  const price = purchase?.price as Record<string, unknown> | undefined;
  const saleAmount = (price?.value as number) ?? 0;

  // We compute the commission ourselves (producer is the only Hotmart affiliate in the
  // PIX model). Rate precedence: the influencer's own rate, then the brand rate, then 20%.
  const brandRate = await getBrandCommissionRate(supabase, product?.id);
  const rate =
    profile.commission_rate != null ? Number(profile.commission_rate) : brandRate;
  const commissionAmount = computeCommission(saleAmount, rate);

  const soldAt = purchase?.approved_date
    ? new Date(purchase.approved_date as number).toISOString()
    : purchase?.order_date
      ? new Date(purchase.order_date as number).toISOString()
      : new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("hotmart_sales") as any).insert({
    profile_id: profile.id,
    transaction_id: transactionId,
    product_name: (product?.name as string) ?? "Produto Hotmart",
    sale_amount: saleAmount,
    commission_amount: commissionAmount,
    status,
    sold_at: soldAt,
    purchase_complete_at: markComplete ? new Date().toISOString() : null,
  });
}

async function handleStatusUpdate(data: Record<string, unknown>, status: SaleStatus) {
  const purchase = data.purchase as Record<string, unknown> | undefined;
  const transactionId = purchase?.transaction as string | undefined;
  if (!transactionId) return;

  const supabase = createAdminClient();

  const { data: sale } = await supabase
    .from("hotmart_sales")
    .select("commission_amount, payout_id")
    .eq("transaction_id", transactionId)
    .single<{ commission_amount: number; payout_id: string | null }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("hotmart_sales") as any)
    .update({ status })
    .eq("transaction_id", transactionId);

  // If the refunded sale was sitting in an UNPAID payout request, take it out of that
  // request and reduce the request total so the admin never pays for a refunded sale.
  if (sale?.payout_id) {
    const { data: payout } = await supabase
      .from("payouts")
      .select("status, commission_amount, sales_count")
      .eq("id", sale.payout_id)
      .single<{ status: string; commission_amount: number; sales_count: number }>();

    if (payout?.status === "requested") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("hotmart_sales") as any)
        .update({ payout_id: null })
        .eq("transaction_id", transactionId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("payouts") as any)
        .update({
          commission_amount: Math.max(
            0,
            Number(payout.commission_amount) - Number(sale.commission_amount),
          ),
          sales_count: Math.max(0, payout.sales_count - 1),
        })
        .eq("id", sale.payout_id);
    } else if (payout?.status === "paid") {
      // Already paid out → needs a manual clawback (net against future earnings).
      console.log(
        "[hotmart-webhook] refund on an already-PAID payout — clawback needed:",
        { transactionId, payoutId: sale.payout_id },
      );
    }
  }
}

const DEFAULT_COMMISSION_RATE = 0.2;

async function getBrandCommissionRate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  productId: unknown,
): Promise<number> {
  if (productId == null) return DEFAULT_COMMISSION_RATE;
  const { data: brand } = await supabase
    .from("brands")
    .select("commission_rate")
    .eq("hotmart_product_id", String(productId))
    .single();
  const rate = Number(brand?.commission_rate);
  return rate > 0 ? rate : DEFAULT_COMMISSION_RATE;
}

type MatchedProfile = { id: string; commission_rate: number | null };

async function matchSaleToProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sck: string | null,
  affiliateCode: string | null,
  buyerEmail: string | undefined,
): Promise<MatchedProfile | null> {
  // Primary (PIX model): the influencer's referral_tag carried as `sck`.
  if (sck) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, commission_rate")
      .eq("referral_tag", sck)
      .single();

    if (profile) return profile as MatchedProfile;
  }

  if (affiliateCode) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, commission_rate")
      .eq("hotmart_affiliate_code", affiliateCode)
      .single();

    if (profile) return profile as MatchedProfile;
  }

  if (buyerEmail) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, commission_rate")
      .eq("email", buyerEmail)
      .eq("is_admin", false)
      .single();

    if (profile) return profile as MatchedProfile;
  }

  return null;
}
