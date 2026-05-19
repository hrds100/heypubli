import { AdminBrands } from "@/features/admin-brands";
import { BRANDS, FUTURE_BRANDS } from "@/mocks/brands.mock";

const MOCK_BRAND_ROWS = [
  { brand: BRANDS[0], influencerCount: 8 },
  ...FUTURE_BRANDS.map((b) => ({ brand: b, influencerCount: 0 })),
];

export default function MarcasPage() {
  return <AdminBrands brands={MOCK_BRAND_ROWS} />;
}
