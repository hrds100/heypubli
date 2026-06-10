import { AdminInfluencers } from "@/features/admin-influencers";
import {
  getAllProfiles,
  getAllInstagramConnections,
  getSalesByInfluencer,
  getClickCountsByInfluencer,
} from "@/lib/data";
import { getDefaultCampaign, getCampaignMemberIdSet } from "@/lib/data/campaigns";

export const dynamic = "force-dynamic";

export default async function InfluenciadoresPage() {
  const [profiles, connections, salesByInfluencer, clicksByInfluencer, campaign] =
    await Promise.all([
      getAllProfiles(),
      getAllInstagramConnections(),
      getSalesByInfluencer(),
      getClickCountsByInfluencer(),
      getDefaultCampaign(),
    ]);

  const campaignMemberIds = campaign
    ? await getCampaignMemberIdSet(campaign.id)
    : new Set<string>();

  const connectionMap = new Map(connections.map((c) => [c.profile_id, c]));
  const salesMap = new Map(salesByInfluencer.map((s) => [s.profileId, s]));

  const rows = profiles.map((profile) => ({
    profile,
    instagram: connectionMap.get(profile.id) ?? null,
    totalSales: salesMap.get(profile.id)?.totalSales ?? 0,
    commission: salesMap.get(profile.id)?.totalCommission ?? 0,
    clicks: clicksByInfluencer.get(profile.id) ?? 0,
  }));

  return (
    <AdminInfluencers
      influencers={rows}
      campaignId={campaign?.id ?? null}
      campaignMemberIds={[...campaignMemberIds]}
    />
  );
}
