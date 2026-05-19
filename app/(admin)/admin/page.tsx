import { AdminOverview } from "@/features/admin-overview";

const MOCK_STATS = {
  totalInfluencers: 25,
  connectedInfluencers: 18,
  pendingInfluencers: 7,
  postsToday: 3,
  postsThisWeek: 14,
  totalSales: 42,
};

const MOCK_ALERTS = [
  {
    id: "1",
    type: "warning" as const,
    message: "3 influenciadores sem Instagram conectado",
  },
  { id: "2", type: "error" as const, message: "Token expirado: @maria_fit" },
];

export default function AdminPage() {
  return <AdminOverview stats={MOCK_STATS} alerts={MOCK_ALERTS} />;
}
