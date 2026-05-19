import { createClient } from "@/lib/supabase/server";

export async function getMessagesByProfile(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages_log")
    .select("*")
    .eq("profile_id", profileId)
    .order("sent_at", { ascending: false });
  return data ?? [];
}

export async function getAllMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages_log")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(100);
  return data ?? [];
}
