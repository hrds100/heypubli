import { AdminScheduler } from "@/features/admin-scheduler";
import { getAllProfiles, getAllBrands } from "@/lib/data";
import { getPostingSettingsAdmin } from "@/lib/data/outstand";

export default async function AgendadorPage() {
  const [profiles, brands, postingSettings] = await Promise.all([
    getAllProfiles(),
    getAllBrands(),
    getPostingSettingsAdmin(),
  ]);

  const influencers = profiles.map((p) => ({
    id: p.id,
    first_name: p.first_name,
    last_name: p.last_name,
  }));

  const brandOptions = brands.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  return (
    <AdminScheduler
      influencers={influencers}
      brands={brandOptions}
      activeProvider={postingSettings?.active_provider}
    />
  );
}
