import { DashboardSettings } from "@/features/dashboard-settings";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import { SECTORS } from "@/mocks/sectors.mock";

export default function ConfiguracoesPage() {
  return (
    <DashboardSettings
      profile={MOCK_INFLUENCER}
      sectors={SECTORS}
      selectedSectors={["saude-bem-estar", "alimentacao"]}
      instagramConnected={true}
      instagramUsername="@anasilva"
    />
  );
}
