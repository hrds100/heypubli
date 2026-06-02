"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import type { PostingSettings } from "@/types/database";

interface AdminPostingSettingsProps {
  settings: PostingSettings | null;
}

export function AdminPostingSettings({ settings }: AdminPostingSettingsProps) {
  const [provider, setProvider] = useState(settings?.active_provider ?? "heypubli");
  const [apiKey, setApiKey] = useState(settings?.outstand_api_key ?? "");
  const [networkId, setNetworkId] = useState(settings?.outstand_social_network_id ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/posting-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_provider: provider,
          outstand_api_key: provider === "outstand" ? apiKey : null,
          outstand_social_network_id: provider === "outstand" ? networkId : null,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2">
          <Settings size={20} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold">Configurações de Publicação</h1>
      </div>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Provedor de Publicação</h2>
        <p className="mb-4 text-sm text-foreground-secondary">
          Escolha qual sistema será usado para publicar posts no Instagram.
        </p>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 hover:bg-background-secondary">
            <input
              type="radio"
              name="provider"
              value="heypubli"
              checked={provider === "heypubli"}
              onChange={() => setProvider("heypubli")}
              className="text-accent"
            />
            <div>
              <span className="font-medium">HeyPubli (Meta direto)</span>
              <p className="text-xs text-foreground-secondary">
                Publica diretamente via Meta Graph API
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 hover:bg-background-secondary">
            <input
              type="radio"
              name="provider"
              value="outstand"
              checked={provider === "outstand"}
              onChange={() => setProvider("outstand")}
              className="text-accent"
            />
            <div>
              <span className="font-medium">Outstand.so</span>
              <p className="text-xs text-foreground-secondary">
                Publica via Outstand API (intermediário)
              </p>
            </div>
          </label>
        </div>
      </section>

      {provider === "outstand" && (
        <section className="rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Configuração Outstand</h2>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="outstand-api-key"
                className="text-sm font-medium text-foreground-secondary"
              >
                API Key
              </label>
              <input
                id="outstand-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_live_..."
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="outstand-network-id"
                className="text-sm font-medium text-foreground-secondary"
              >
                Social Network ID
              </label>
              <input
                id="outstand-network-id"
                type="text"
                value={networkId}
                onChange={(e) => setNetworkId(e.target.value)}
                placeholder="net_..."
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-foreground-secondary">
                ID retornado ao registrar suas credenciais Meta no Outstand
              </p>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{error}</div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Configurações"}
      </button>
    </div>
  );
}
