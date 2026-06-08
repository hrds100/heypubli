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
    case "PURCHASE_COMPLETE":
      await handlePurchase(data, "confirmed");
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

async function handlePurchase(data: Record<string, unknown>, status: SaleStatus) {
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

  if (existing) return;

  const affiliates = data.affiliates as Array<Record<string, unknown>> | undefined;

  // PIX model: the influencer's referral_tag rides along as Hotmart's `sck`.
  const sck = extractSck(data)?.toLowerCase() ?? null;
  const affiliateCode = (affiliates?.[0]?.affiliate_code as string) ?? null;

  const profileId = await matchSaleToProfile(
    supabase,
    sck,
    affiliateCode,
    buyer?.email as string | undefined,
  );

  if (!profileId) {
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

  // We compute the influencer's commission ourselves (the producer is the only Hotmart
  // affiliate in the PIX model, so Hotmart's affiliate-commission value doesn't apply).
  const rate = await getBrandCommissionRate(supabase, product?.id);
  const commissionAmount = computeCommission(saleAmount, rate);

  const soldAt = purchase?.approved_date
    ? new Date(purchase.approved_date as number).toISOString()
    : purchase?.order_date
      ? new Date(purchase.order_date as number).toISOString()
      : new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("hotmart_sales") as any).insert({
    profile_id: profileId,
    transaction_id: transactionId,
    product_name: (product?.name as string) ?? "Produto Hotmart",
    sale_amount: saleAmount,
    commission_amount: commissionAmount,
    status,
    sold_at: soldAt,
  });
}

async function handleStatusUpdate(data: Record<string, unknown>, status: SaleStatus) {
  const purchase = data.purchase as Record<string, unknown> | undefined;
  const transactionId = purchase?.transaction as string | undefined;
  if (!transactionId) return;

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("hotmart_sales") as any)
    .update({ status })
    .eq("transaction_id", transactionId);
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

async function matchSaleToProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sck: string | null,
  affiliateCode: string | null,
  buyerEmail: string | undefined,
): Promise<string | null> {
  // Primary (PIX model): the influencer's referral_tag carried as `sck`.
  if (sck) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_tag", sck)
      .single();

    if (profile) return (profile as { id: string }).id;
  }

  if (affiliateCode) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("hotmart_affiliate_code", affiliateCode)
      .single();

    if (profile) return (profile as { id: string }).id;
  }

  if (buyerEmail) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", buyerEmail)
      .eq("is_admin", false)
      .single();

    if (profile) return (profile as { id: string }).id;
  }

  return null;
}
