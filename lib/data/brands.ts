import { createClient } from "@/lib/supabase/server";

export async function getActiveBrands() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function getFutureBrands() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", false)
    .order("name");
  return data ?? [];
}

export async function getAllBrands() {
  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").order("name");
  return data ?? [];
}

export async function getBrandAssignmentCount(brandId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("brand_assignments")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", brandId);
  return count ?? 0;
}
