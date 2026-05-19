import { DashboardAnalytics } from "@/features/dashboard-analytics";

export default function AnalyticsPage() {
  return (
    <DashboardAnalytics
      totalSales={12}
      totalCommission={359.4}
      affiliateClicks={234}
      lastPublishedAt="18/05/2026"
      monthlySales={[
        { month: "Maio 2026", sales: 8, commission: 239.6 },
        { month: "Abril 2026", sales: 4, commission: 119.8 },
      ]}
    />
  );
}
