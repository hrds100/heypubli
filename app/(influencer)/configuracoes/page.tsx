import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSettings } from "@/features/dashboard-settings";
import { getInstagramConnection, getAllSectors, getInfluencerSectors } from "@/lib/data";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
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

  if (!profile) redirect("/login");

  const [instagram, sectors, influencerSectors] = await Promise.all([
    getInstagramConnection(user.id),
    getAllSectors(),
    getInfluencerSectors(user.id),
  ]);

  const selectedSectorIds = influencerSectors.map((is) => is.sector_id);

  return (
    <DashboardSettings
      profile={profile as Profile}
      sectors={sectors}
      selectedSectors={selectedSectorIds}
      instagramConnected={!!instagram}
      instagramUsername={instagram ? `@${instagram.ig_username}` : null}
    />
  );
}
