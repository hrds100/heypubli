"use client";

import { useTransition, useState } from "react";
import { ShoppingCart, DollarSign, MousePointerClick, Clock } from "lucide-react";
import { savePixKey } from "@/lib/actions/settings";

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
  pixKeyType: string | null;
  pixKey: string | null;
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
    <div className="rounded-xl border border-border p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2">
          <Icon size={20} className="text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-foreground-secondary truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PixCard({
  pixKeyType,
  pixKey,
}: {
  pixKeyType: string | null;
  pixKey: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaved(false);
    startTransition(async () => {
      const result = await savePixKey(formData);
      if (result.success) setSaved(true);
    });
  };

  return (
    <div className="rounded-xl border border-border p-4 sm:p-5">
      <h2 className="mb-3 text-base font-semibold">Chave PIX</h2>
      <p className="mb-4 text-xs text-foreground-secondary">
        Cadastre sua chave PIX para receber seus pagamentos
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground-secondary">Tipo</label>
          <select
            name="pix_key_type"
            defaultValue={pixKeyType ?? ""}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Selecione</option>
            <option value="cpf">CPF</option>
            <option value="email">Email</option>
            <option value="phone">Telefone</option>
            <option value="random">Chave aleatória</option>
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-foreground-secondary">Chave</label>
          <input
            name="pix_key"
            defaultValue={pixKey ?? ""}
            placeholder="Sua chave PIX"
            className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

export function DashboardAnalytics({
  totalSales,
  totalCommission,
  monthlySales,
  lastPublishedAt,
  affiliateClicks,
  pixKeyType,
  pixKey,
}: DashboardAnalyticsProps) {
  const formattedCommission = `R$ ${totalCommission.toFixed(2).replace(".", ",")}`;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Vendas</h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Acompanhe suas vendas e comissões
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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

      <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
        <svg
          className="h-5 w-5 shrink-0 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-foreground-secondary">
          <span className="font-medium text-foreground">Prazo de pagamento: 21 dias</span>{" "}
          após a venda confirmada. Período de garantia contra reembolsos.
        </p>
      </div>

      <div className="rounded-xl border border-border p-4 sm:p-5">
        <h2 className="mb-4 text-base font-semibold">Vendas por mês</h2>
        {monthlySales.length === 0 ? (
          <p className="text-foreground-secondary text-sm">
            Nenhuma venda registrada ainda. Seus dados aparecerão aqui quando começar a
            vender.
          </p>
        ) : (
          <div className="space-y-2">
            {monthlySales.map((m) => (
              <div key={m.month} className="flex items-center justify-between text-sm">
                <span>{m.month}</span>
                <span className="font-medium">
                  {m.sales} vendas · R$ {m.commission.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <PixCard pixKeyType={pixKeyType} pixKey={pixKey} />
    </div>
  );
}
