import { AdminCampaign } from "@/features/admin-campaign";
import {
  getAccountsNotInCampaign,
  getCampaignItems,
  getCampaignMembersWithProfiles,
  getDefaultCampaign,
} from "@/lib/data/campaigns";
import { getAllBrands } from "@/lib/data";

export default async function CampanhaPage() {
  const campaign = await getDefaultCampaign();

  if (!campaign) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Campanha</h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Nenhuma campanha encontrada. Rode a migração 012 para criar a campanha padrão.
        </p>
      </div>
    );
  }

  const [items, members, candidates, brands] = await Promise.all([
    getCampaignItems(campaign.id),
    getCampaignMembersWithProfiles(campaign.id),
    getAccountsNotInCampaign(campaign.id),
    getAllBrands(),
  ]);

  return (
    <AdminCampaign
      campaign={campaign}
      items={items}
      members={members}
      candidates={candidates}
      brands={brands.map((b) => ({ id: b.id, name: b.name }))}
    />
  );
}
