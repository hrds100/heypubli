"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Mail, MessageSquare } from "lucide-react";
import type { Profile, InstagramConnection } from "@/types/database";

interface InfluencerRow {
  profile: Profile;
  instagram: InstagramConnection | null;
  totalSales: number;
  commission: number;
}

interface AdminInfluencersProps {
  influencers: InfluencerRow[];
}

export function AdminInfluencers({ influencers }: AdminInfluencersProps) {
  const [search, setSearch] = useState("");

  const filtered = influencers.filter(
    (i) =>
      i.profile.first_name.toLowerCase().includes(search.toLowerCase()) ||
      i.profile.last_name.toLowerCase().includes(search.toLowerCase()) ||
      i.profile.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Influenciadores</h1>
        <span className="text-sm text-foreground-secondary">
          {influencers.length} total
        </span>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary"
        />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border py-2.5 pl-10 pr-4 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-secondary">
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Nome
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Instagram
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Vendas
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Comissão
              </th>
              <th className="px-4 py-3 text-left font-medium text-foreground-secondary">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.profile.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">
                  {row.profile.first_name} {row.profile.last_name}
                </td>
                <td className="px-4 py-3 text-foreground-secondary">
                  {row.profile.email}
                </td>
                <td className="px-4 py-3">
                  {row.instagram ? (
                    <span className="text-accent">@{row.instagram.ig_username}</span>
                  ) : (
                    <span className="text-foreground-secondary">-</span>
                  )}
                </td>
                <td className="px-4 py-3">{row.totalSales}</td>
                <td className="px-4 py-3">
                  R$ {row.commission.toFixed(2).replace(".", ",")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded p-1 hover:bg-background-secondary"
                      title="WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      className="rounded p-1 hover:bg-background-secondary"
                      title="Email"
                    >
                      <Mail size={16} />
                    </button>
                    <Link
                      href={`/admin/influenciadores/${row.profile.id}`}
                      className="rounded p-1 hover:bg-background-secondary inline-flex"
                      title="Ver perfil"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-foreground-secondary"
                >
                  Nenhum influenciador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
