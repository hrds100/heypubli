"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { availableBalance, type ClearableSale } from "@/lib/payouts";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type SaleRow = ClearableSale & { id: string; commission_amount: number };

/**
 * Influencer requests payout of their cleared balance. Creates a `requested` payout
 * (snapshotting their PIX key) and stamps the included sales so they can't be paid twice.
 */
export async function requestPayout(): Promise<
  { error: string } | { success: true; amount: number }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Service-role: read this influencer's cleared sales + write the payout (RLS-bypassing,
  // same pattern as the webhook). We only ever act on the caller's own rows.
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("pix_key, pix_key_type")
    .eq("id", user.id)
    .single<{ pix_key: string | null; pix_key_type: string | null }>();

  const { data: salesData } = await admin
    .from("hotmart_sales")
    .select("id, commission_amount, status, payout_id, purchase_complete_at, sold_at")
    .eq("profile_id", user.id)
    .eq("status", "confirmed")
    .is("payout_id", null);

  const { amount, saleIds, count } = availableBalance(
    (salesData as SaleRow[] | null) ?? [],
  );
  if (amount <= 0 || saleIds.length === 0) {
    return { error: "Nenhum valor disponível para saque ainda." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payout, error } = await (admin.from("payouts") as any)
    .insert({
      profile_id: user.id,
      commission_amount: amount,
      sales_count: count,
      status: "requested",
      pix_key: profile?.pix_key ?? null,
      pix_key_type: profile?.pix_key_type ?? null,
    })
    .select("id")
    .single();

  if (error || !payout) {
    return { error: "Não foi possível solicitar o pagamento. Tente novamente." };
  }

  // Stamp the settled sales so the same commission can't be requested again.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("hotmart_sales") as any)
    .update({ payout_id: (payout as { id: string }).id })
    .in("id", saleIds);

  revalidatePath("/vendas");
  revalidatePath("/dashboard");
  return { success: true, amount };
}
