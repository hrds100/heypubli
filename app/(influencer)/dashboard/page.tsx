import { DashboardHome } from "@/features/dashboard-home";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import { BRANDS, FUTURE_BRANDS } from "@/mocks/brands.mock";

export default function DashboardPage() {
  return (
    <DashboardHome
      profile={MOCK_INFLUENCER}
      activeBrands={BRANDS}
      futureBrands={FUTURE_BRANDS}
      instagramConnected={true}
    />
  );
}
