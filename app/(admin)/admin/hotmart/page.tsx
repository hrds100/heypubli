import { AdminHotmart } from "@/features/admin-hotmart";
import type { HotmartSale } from "@/types/database";

const MOCK_SALES: HotmartSale[] = [
  {
    id: "sale-1",
    profile_id: "user-1",
    transaction_id: "TXN-001",
    product_name: "ScanPlates Premium",
    sale_amount: 59.99,
    commission_amount: 29.95,
    status: "confirmed",
    sold_at: "2026-05-19T14:00:00Z",
  },
  {
    id: "sale-2",
    profile_id: "user-1",
    transaction_id: "TXN-002",
    product_name: "ScanPlates Premium",
    sale_amount: 59.99,
    commission_amount: 29.95,
    status: "confirmed",
    sold_at: "2026-05-18T11:00:00Z",
  },
];

const MOCK_BY_INFLUENCER = [
  { profileId: "user-1", name: "Ana Silva", totalSales: 12, totalCommission: 359.4 },
];

export default function HotmartPage() {
  return (
    <AdminHotmart
      sales={MOCK_SALES}
      byInfluencer={MOCK_BY_INFLUENCER}
      totalRevenue={719.88}
      totalCommission={359.4}
    />
  );
}
