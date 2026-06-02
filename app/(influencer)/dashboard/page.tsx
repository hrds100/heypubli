import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHome } from "@/features/dashboard-home";
import { getInstagramProfile } from "@/lib/integrations/instagram";
import { getPostingSettingsAdmin } from "@/lib/data/outstand";
import type { InstagramData } from "@/features/dashboard-home";
import type { Profile, Brand } from "@/types/database";

export const dynamic = "force-dynamic";

interface IgConnection {
  access_token: string;
  ig_username: string;
  followers_count: number | null;
}

async function getInstagramData(profileId: string): Promise<InstagramData | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: connection } = (await (supabase.from("instagram_connections") as any)
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_connected", true)
    .single()) as { data: IgConnection | null };

  if (!connection) return null;

  try {
    const igProfile = await getInstagramProfile(connection.access_token);
    return {
      username: igProfile.username,
      name: igProfile.name,
      biography: igProfile.biography,
      profilePictureUrl: igProfile.profile_picture_url,
      followersCount: igProfile.followers_count ?? 0,
      followsCount: igProfile.follows_count ?? 0,
      mediaCount: igProfile.media_count,
      accountType: igProfile.account_type,
      isConnected: true,
    };
  } catch {
    return {
      username: connection.ig_username,
      followersCount: connection.followers_count ?? 0,
      followsCount: 0,
      mediaCount: 0,
      accountType: "BUSINESS",
      isConnected: true,
    };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fallbackProfile: Profile =
    profile ??
    ({
      id: user.id,
      first_name: user.user_metadata?.first_name ?? "Influenciador",
      last_name: user.user_metadata?.last_name ?? "",
      email: user.email ?? "",
      is_admin: false,
      onboarding_complete: false,
      onboarding_step: 1,
      created_at: new Date().toISOString(),
      date_of_birth: null,
      gender: null,
      address_street: null,
      address_city: null,
      address_postal_code: null,
      address_country: "BR",
      phone: null,
      whatsapp: null,
      timezone: "America/Sao_Paulo",
      pix_key_type: null,
      pix_key: null,
      hotmart_url: null,
      hotmart_affiliate_code: null,
      last_accessed_at: null,
    } as Profile);

  const [instagram, postingSettings] = await Promise.all([
    getInstagramData(user.id),
    getPostingSettingsAdmin(),
  ]);

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true);

  const connectUrl =
    postingSettings?.active_provider === "outstand"
      ? "/api/outstand/connect"
      : "/api/instagram/connect";

  return (
    <DashboardHome
      profile={fallbackProfile}
      activeBrands={(brands as Brand[]) ?? []}
      instagram={instagram}
      connectUrl={connectUrl}
    />
  );
}
