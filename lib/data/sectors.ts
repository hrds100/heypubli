import { createClient } from "@/lib/supabase/server";

export async function getAllSectors() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sectors")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getInfluencerSectors(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("influencer_sectors")
    .select("sector_id, type")
    .eq("profile_id", profileId);
  return data ?? [];
}
