import { createClient } from "@/lib/supabase/server";

export async function getInstagramConnection(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("instagram_connections")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_connected", true)
    .single();
  return data;
}

export async function getAllInstagramConnections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("instagram_connections")
    .select("*")
    .eq("is_connected", true);
  return data ?? [];
}
