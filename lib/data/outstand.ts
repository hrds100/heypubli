import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PostingSettings, OutstandConnection } from "@/types/database";

// --- Posting Settings ---

export async function getPostingSettings(): Promise<PostingSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("posting_settings").select("*").limit(1).single();
  return (data as PostingSettings | null) ?? null;
}

export async function getPostingSettingsAdmin(): Promise<PostingSettings | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("posting_settings").select("*").limit(1).single();
  return (data as PostingSettings | null) ?? null;
}

export async function savePostingSettings(params: {
  active_provider: string;
  outstand_api_key?: string | null;
  outstand_social_network_id?: string | null;
}): Promise<void> {
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("posting_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("posting_settings") as any)
      .update({ ...params, updated_at: new Date().toISOString() })
      .eq("id", (existing as { id: string }).id);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("posting_settings") as any).insert(params);
  }
}

// --- Outstand Connections ---

export async function getOutstandConnection(
  profileId: string,
): Promise<OutstandConnection | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("outstand_connections")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_connected", true)
    .single();
  return (data as OutstandConnection | null) ?? null;
}

export async function getAllOutstandConnections(): Promise<OutstandConnection[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("outstand_connections")
    .select("*")
    .eq("is_connected", true);
  return (data as OutstandConnection[] | null) ?? [];
}

export async function saveOutstandConnection(
  profileId: string,
  socialAccountId: string,
  igUsername: string | null,
): Promise<void> {
  const admin = createAdminClient();
  const row = {
    profile_id: profileId,
    outstand_social_account_id: socialAccountId,
    ig_username: igUsername,
    is_connected: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("outstand_connections") as any).upsert(row, {
    onConflict: "profile_id",
  });
}

export async function disconnectOutstand(connectionId: string): Promise<void> {
  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("outstand_connections") as any)
    .update({ is_connected: false })
    .eq("id", connectionId);
}

export async function saveOutstandPostId(
  postId: string,
  outstandPostId: string,
): Promise<void> {
  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("scheduled_posts") as any)
    .update({ outstand_post_id: outstandPostId })
    .eq("id", postId);
}
