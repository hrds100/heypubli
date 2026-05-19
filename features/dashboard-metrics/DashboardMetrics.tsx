"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";

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

interface DashboardMetricsProps {
  profileMetrics: ProfileMetrics[];
  isConnected?: boolean;
  igUsername?: string;
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

function HorizontalBar({
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

export function DashboardMetrics({
  profileMetrics,
  isConnected = false,
  igUsername,
}: DashboardMetricsProps) {
  const [periodIndex, setPeriodIndex] = useState(0);
  const metrics = profileMetrics[periodIndex];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Métricas do Perfil</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Dados do Instagram em tempo real
          </p>
        </div>
        {profileMetrics.length > 0 && (
          <select
            value={periodIndex}
            onChange={(e) => setPeriodIndex(Number(e.target.value))}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {profileMetrics.map((m, i) => (
              <option key={m.period} value={i}>
                {m.period}
              </option>
            ))}
          </select>
        )}
      </div>

      {metrics ? (
        <>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={Heart}
              label="Engajamento"
              value={`${metrics.engagement.toFixed(1)}%`}
              change={metrics.engagementChange || undefined}
            />
            <MetricCard
              icon={Heart}
              label="Curtidas"
              value={metrics.likes.toLocaleString("pt-BR")}
            />
            <MetricCard
              icon={MessageCircle}
              label="Comentários"
              value={metrics.comments.toLocaleString("pt-BR")}
            />
            {metrics.reach > 0 && (
              <MetricCard
                icon={Eye}
                label="Interações totais"
                value={metrics.reach.toLocaleString("pt-BR")}
              />
            )}
            {metrics.newFollowers > 0 && (
              <MetricCard
                icon={UserPlus}
                label="Novos seguidores"
                value={`+${metrics.newFollowers}`}
                change={metrics.followersChange || undefined}
              />
            )}
            {metrics.profileVisits > 0 && (
              <MetricCard
                icon={Users}
                label="Visitas ao perfil"
                value={metrics.profileVisits.toLocaleString("pt-BR")}
              />
            )}
          </div>

          {metrics.contentBreakdown.length > 0 && (
            <div className="rounded-xl border border-border p-4 sm:p-5">
              <h3 className="mb-3 text-sm font-semibold">
                Performance por tipo de conteúdo
              </h3>
              {metrics.contentBreakdown.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
                >
                  <span className="font-medium">{item.type}</span>
                  <div className="flex gap-4 text-foreground-secondary">
                    <span>{item.reach.toLocaleString("pt-BR")} interações</span>
                    <span>{item.engagement.toFixed(1)}% eng.</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {metrics.topCities.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border p-4 sm:p-5">
                <h3 className="mb-3 text-sm font-semibold">Principais cidades</h3>
                <HorizontalBar
                  data={metrics.topCities.map((c) => ({ label: c.name, value: c.count }))}
                  maxValue={Math.max(...metrics.topCities.map((c) => c.count), 1)}
                />
              </div>
              {metrics.topCountries.length > 0 && (
                <div className="rounded-xl border border-border p-4 sm:p-5">
                  <h3 className="mb-3 text-sm font-semibold">Principais países</h3>
                  <HorizontalBar
                    data={metrics.topCountries.map((c) => ({
                      label: c.name,
                      value: c.count,
                    }))}
                    maxValue={Math.max(...metrics.topCountries.map((c) => c.count), 1)}
                  />
                </div>
              )}
              {metrics.ageGender.length > 0 && (
                <div className="rounded-xl border border-border p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
                  <h3 className="mb-3 text-sm font-semibold">Idade e gênero</h3>
                  <AgeGenderChart data={metrics.ageGender} />
                </div>
              )}
            </div>
          )}
        </>
      ) : isConnected ? (
        <div className="rounded-xl border border-border bg-background-secondary p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Eye size={28} className="text-success" />
          </div>
          <p className="mt-4 text-lg font-semibold">
            Instagram conectado{igUsername ? ` — @${igUsername}` : ""}
          </p>
          <p className="mt-2 text-sm text-foreground-secondary">
            As métricas detalhadas do seu perfil aparecerão aqui em breve. Estamos
            coletando os dados da sua conta.
          </p>
        </div>
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
