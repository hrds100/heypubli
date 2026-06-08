import { AdminInfluencers } from "@/features/admin-influencers";
import {
  getAllProfiles,
  getAllInstagramConnections,
  getSalesByInfluencer,
  getClickCountsByInfluencer,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InfluenciadoresPage() {
  const [profiles, connections, salesByInfluencer, clicksByInfluencer] =
    await Promise.all([
      getAllProfiles(),
      getAllInstagramConnections(),
      getSalesByInfluencer(),
      getClickCountsByInfluencer(),
    ]);

  const connectionMap = new Map(connections.map((c) => [c.profile_id, c]));
  const salesMap = new Map(salesByInfluencer.map((s) => [s.profileId, s]));

  const rows = profiles.map((profile) => ({
    profile,
    instagram: connectionMap.get(profile.id) ?? null,
    totalSales: salesMap.get(profile.id)?.totalSales ?? 0,
    commission: salesMap.get(profile.id)?.totalCommission ?? 0,
    clicks: clicksByInfluencer.get(profile.id) ?? 0,
  }));

  return <AdminInfluencers influencers={rows} />;
}
