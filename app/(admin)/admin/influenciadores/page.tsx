import { AdminInfluencers } from "@/features/admin-influencers";
import {
  getAllProfiles,
  getAllInstagramConnections,
  getSalesByInfluencer,
} from "@/lib/data";

export default async function InfluenciadoresPage() {
  const [profiles, connections, salesByInfluencer] = await Promise.all([
    getAllProfiles(),
    getAllInstagramConnections(),
    getSalesByInfluencer(),
  ]);

  const connectionMap = new Map(connections.map((c) => [c.profile_id, c]));
  const salesMap = new Map(salesByInfluencer.map((s) => [s.profileId, s]));

  const rows = profiles.map((profile) => ({
    profile,
    instagram: connectionMap.get(profile.id) ?? null,
    totalSales: salesMap.get(profile.id)?.totalSales ?? 0,
    commission: salesMap.get(profile.id)?.totalCommission ?? 0,
  }));

  return <AdminInfluencers influencers={rows} />;
}
