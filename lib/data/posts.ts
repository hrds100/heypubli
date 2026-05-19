import { createClient } from "@/lib/supabase/server";

export async function getPostsByProfile(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("profile_id", profileId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}

export async function getPostsToday() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("scheduled_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("published_at", today.toISOString());
  return count ?? 0;
}

export async function getPostsThisWeek() {
  const supabase = await createClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count } = await supabase
    .from("scheduled_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("published_at", weekAgo.toISOString());
  return count ?? 0;
}
