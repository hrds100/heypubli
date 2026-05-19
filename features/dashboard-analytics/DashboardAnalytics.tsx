"use client";

import { useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  MousePointerClick,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MonthlySale {
  month: string;
  sales: number;
  commission: number;
}

export interface ProfileMetrics {
  period: string;
  reach: number;
  reachChange: number;
  views: number;
  viewsChange: number;
  engagement: number;
  engagementChange: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  newFollowers: number;
  followersChange: number;
  profileVisits: number;
  topCities: { name: string; count: number }[];
  topCountries: { name: string; count: number }[];
  ageGender: { range: string; male: number; female: number }[];
  contentBreakdown: { type: string; reach: number; engagement: number }[];
}

interface DashboardAnalyticsProps {
  totalSales: number;
  totalCommission: number;
  monthlySales: MonthlySale[];
  lastPublishedAt: string | null;
  affiliateClicks: number;
  profileMetrics: ProfileMetrics[];
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
    <div className="rounded-xl border border-border p-4 sm:p-6">
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

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-foreground-secondary">
        <Icon size={16} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <div
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-success" : "text-error"}`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change >= 0 ? "+" : ""}
          {change}% vs mês anterior
        </div>
      )}
    </div>
  );
}

function BarChart({
  data,
  maxValue,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
}) {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-foreground-secondary truncate">
            {item.label}
          </span>
          <div className="flex-1 h-5 rounded-full bg-background-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584]"
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <span className="w-12 text-right text-xs font-medium">
            {item.value.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}

function AgeGenderChart({ data }: { data: ProfileMetrics["ageGender"] }) {
  const max = Math.max(...data.flatMap((d) => [d.male, d.female]), 1);
  return (
    <div className="space-y-2">
      {data.map((row) => (
        <div key={row.range} className="flex items-center gap-2">
          <span className="w-12 shrink-0 text-xs text-foreground-secondary text-right">
            {row.range}
          </span>
          <div className="flex flex-1 gap-1">
            <div className="flex-1 flex justify-end">
              <div
                className="h-5 rounded-l-full bg-blue-400"
                style={{ width: `${(row.male / max) * 100}%` }}
              />
            </div>
            <div className="flex-1">
              <div
                className="h-5 rounded-r-full bg-accent"
                style={{ width: `${(row.female / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center gap-6 pt-2 text-xs text-foreground-secondary">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400" /> Masculino
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Feminino
        </span>
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
  profileMetrics,
}: DashboardAnalyticsProps) {
  const [periodIndex, setPeriodIndex] = useState(0);
  const metrics = profileMetrics[periodIndex];
  const formattedCommission = `R$ ${totalCommission.toFixed(2).replace(".", ",")}`;

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics de Vendas</h1>
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

      <div className="rounded-xl border border-border p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Vendas por mês</h2>
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
                  {m.sales} vendas — R$ {m.commission.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Métricas do Perfil</h1>
            <p className="mt-1 text-sm text-foreground-secondary">
              Dados do Instagram em tempo real
            </p>
          </div>
          {profileMetrics.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPeriodIndex(Math.min(periodIndex + 1, profileMetrics.length - 1))
                }
                disabled={periodIndex >= profileMetrics.length - 1}
                className="rounded-lg border border-border p-2 hover:bg-background-secondary disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-[120px] text-center text-sm font-medium">
                {metrics?.period ?? "—"}
              </span>
              <button
                onClick={() => setPeriodIndex(Math.max(periodIndex - 1, 0))}
                disabled={periodIndex <= 0}
                className="rounded-lg border border-border p-2 hover:bg-background-secondary disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {metrics ? (
        <>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Eye}
              label="Alcance"
              value={metrics.reach.toLocaleString("pt-BR")}
              change={metrics.reachChange}
            />
            <MetricCard
              icon={Eye}
              label="Visualizações"
              value={metrics.views.toLocaleString("pt-BR")}
              change={metrics.viewsChange}
            />
            <MetricCard
              icon={Heart}
              label="Engajamento"
              value={`${metrics.engagement.toFixed(1)}%`}
              change={metrics.engagementChange}
            />
            <MetricCard
              icon={UserPlus}
              label="Novos seguidores"
              value={`+${metrics.newFollowers}`}
              change={metrics.followersChange}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Heart size={18} className="text-error" />
              <div>
                <p className="text-lg font-bold">
                  {metrics.likes.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-foreground-secondary">Curtidas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <MessageCircle size={18} className="text-accent" />
              <div>
                <p className="text-lg font-bold">
                  {metrics.comments.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-foreground-secondary">Comentários</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Share2 size={18} className="text-blue-500" />
              <div>
                <p className="text-lg font-bold">
                  {metrics.shares.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-foreground-secondary">Compartilhamentos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Bookmark size={18} className="text-warning" />
              <div>
                <p className="text-lg font-bold">
                  {metrics.saves.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-foreground-secondary">Salvos</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold">Alcance por tipo de conteúdo</h3>
              {metrics.contentBreakdown.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
                >
                  <span className="font-medium">{item.type}</span>
                  <div className="flex gap-4 text-foreground-secondary">
                    <span>{item.reach.toLocaleString("pt-BR")} alcance</span>
                    <span>{item.engagement.toFixed(1)}% eng.</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-foreground-secondary" />
                <h3 className="text-sm font-semibold">Visitas ao perfil</h3>
              </div>
              <p className="text-3xl font-bold">
                {metrics.profileVisits.toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 text-xs text-foreground-secondary">neste período</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold">Principais cidades</h3>
              <BarChart
                data={metrics.topCities.map((c) => ({ label: c.name, value: c.count }))}
                maxValue={Math.max(...metrics.topCities.map((c) => c.count), 1)}
              />
            </div>
            <div className="rounded-xl border border-border p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold">Principais países</h3>
              <BarChart
                data={metrics.topCountries.map((c) => ({
                  label: c.name,
                  value: c.count,
                }))}
                maxValue={Math.max(...metrics.topCountries.map((c) => c.count), 1)}
              />
            </div>
            <div className="rounded-xl border border-border p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <h3 className="mb-4 text-sm font-semibold">Idade e gênero</h3>
              <AgeGenderChart data={metrics.ageGender} />
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
          <Eye size={32} className="mx-auto text-foreground-secondary/40" />
          <p className="mt-3 font-medium text-foreground-secondary">
            Conecte seu Instagram para ver as métricas do perfil
          </p>
          <a
            href="/api/instagram/connect"
            className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-6 py-2.5 text-sm font-medium text-white"
          >
            Conectar Instagram
          </a>
        </div>
      )}
    </div>
  );
}
