import { AdminInfluencers } from "@/features/admin-influencers";
import {
  getAllProfiles,
  getAllInstagramConnections,
  getSalesByInfluencer,
  getClickCountsByInfluencer,
} from "@/lib/data";
import { getAllOutstandConnections } from "@/lib/data/outstand";
import { getDefaultCampaign, getCampaignMemberIdSet } from "@/lib/data/campaigns";

export const dynamic = "force-dynamic";

export default async function InfluenciadoresPage() {
  const [
    profiles,
    legacyConnections,
    outstandConnections,
    salesByInfluencer,
    clicksByInfluencer,
    campaign,
  ] = await Promise.all([
    getAllProfiles(),
    getAllInstagramConnections(),
    getAllOutstandConnections(),
    getSalesByInfluencer(),
    getClickCountsByInfluencer(),
    getDefaultCampaign(),
  ]);

  const campaignMemberIds = campaign
    ? await getCampaignMemberIdSet(campaign.id)
    : new Set<string>();

  // Outstand is the official connection source; the legacy Meta table fills gaps.
  const handleByProfile = new Map<string, string | null>();
  for (const c of legacyConnections) handleByProfile.set(c.profile_id, c.ig_username);
  for (const c of outstandConnections) handleByProfile.set(c.profile_id, c.ig_username);

  const salesMap = new Map(salesByInfluencer.map((s) => [s.profileId, s]));

  const rows = profiles.map((profile) => ({
    profile,
    igUsername: handleByProfile.get(profile.id) ?? null,
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
