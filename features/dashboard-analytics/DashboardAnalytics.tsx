"use client";

import { ShoppingCart, DollarSign, MousePointerClick, Clock } from "lucide-react";

interface MonthlySale {
  month: string;
  sales: number;
  commission: number;
}

interface DashboardAnalyticsProps {
  totalSales: number;
  totalCommission: number;
  monthlySales: MonthlySale[];
  lastPublishedAt: string | null;
  affiliateClicks: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingCart;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2">
          <Icon size={20} className="text-accent" />
        </div>
        <div>
          <p className="text-sm text-foreground-secondary">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function DashboardAnalytics({
  totalSales,
  totalCommission,
  monthlySales,
  lastPublishedAt,
  affiliateClicks,
}: DashboardAnalyticsProps) {
  const formattedCommission = `R$ ${totalCommission.toFixed(2).replace(".", ",")}`;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingCart} label="Total de vendas" value={totalSales} />
        <StatCard
          icon={DollarSign}
          label="Comissão acumulada"
          value={formattedCommission}
        />
        <StatCard
          icon={MousePointerClick}
          label="Cliques no link"
          value={affiliateClicks}
        />
        <StatCard icon={Clock} label="Último post" value={lastPublishedAt ?? "Nenhum"} />
      </div>

      <div className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Vendas por mês</h2>
        {monthlySales.length === 0 ? (
          <p className="text-foreground-secondary">
            Nenhuma venda registrada ainda. Seus dados aparecerão aqui quando começar a
            vender.
          </p>
        ) : (
          <div className="space-y-2">
            {monthlySales.map((m) => (
              <div key={m.month} className="flex items-center justify-between text-sm">
                <span>{m.month}</span>
                <span className="font-medium">
                  {m.sales} vendas — R$ {m.commission.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
