"use client";

import { useState } from "react";
import { AtSign, Trash2, Check } from "lucide-react";
import type { Profile, Sector } from "@/types/database";

const COUNTRIES = [
  {
    code: "BR",
    name: "Brasil",
    dial: "+55",
    postalLabel: "CEP",
    postalPlaceholder: "00000-000",
  },
  {
    code: "PT",
    name: "Portugal",
    dial: "+351",
    postalLabel: "Código Postal",
    postalPlaceholder: "0000-000",
  },
  {
    code: "US",
    name: "Estados Unidos",
    dial: "+1",
    postalLabel: "ZIP Code",
    postalPlaceholder: "00000",
  },
  {
    code: "GB",
    name: "Reino Unido",
    dial: "+44",
    postalLabel: "Postcode",
    postalPlaceholder: "AA0 0AA",
  },
  {
    code: "AO",
    name: "Angola",
    dial: "+244",
    postalLabel: "Código Postal",
    postalPlaceholder: "000000",
  },
  {
    code: "MZ",
    name: "Moçambique",
    dial: "+258",
    postalLabel: "Código Postal",
    postalPlaceholder: "0000",
  },
  {
    code: "FR",
    name: "França",
    dial: "+33",
    postalLabel: "Code Postal",
    postalPlaceholder: "00000",
  },
  {
    code: "ES",
    name: "Espanha",
    dial: "+34",
    postalLabel: "Código Postal",
    postalPlaceholder: "00000",
  },
  {
    code: "DE",
    name: "Alemanha",
    dial: "+49",
    postalLabel: "PLZ",
    postalPlaceholder: "00000",
  },
  {
    code: "IT",
    name: "Itália",
    dial: "+39",
    postalLabel: "CAP",
    postalPlaceholder: "00000",
  },
];

const DIAL_CODES = [
  { dial: "+55", flag: "🇧🇷" },
  { dial: "+351", flag: "🇵🇹" },
  { dial: "+1", flag: "🇺🇸" },
  { dial: "+44", flag: "🇬🇧" },
  { dial: "+244", flag: "🇦🇴" },
  { dial: "+258", flag: "🇲🇿" },
  { dial: "+33", flag: "🇫🇷" },
  { dial: "+34", flag: "🇪🇸" },
  { dial: "+49", flag: "🇩🇪" },
  { dial: "+39", flag: "🇮🇹" },
];

interface DashboardSettingsProps {
  profile: Profile;
  sectors: Sector[];
  selectedSectors: string[];
  instagramConnected: boolean;
  instagramUsername: string | null;
}

export function DashboardSettings({
  profile,
  instagramConnected,
  instagramUsername,
}: DashboardSettingsProps) {
  const [country, setCountry] = useState(profile.address_country || "BR");
  const [dialCode, setDialCode] = useState("+55");
  const [saved, setSaved] = useState(false);

  const countryInfo = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
        >
          {saved && <Check size={16} />}
          {saved ? "Salvo" : "Salvar alterações"}
        </button>
      </div>

      <section className="rounded-xl border border-border p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
          Dados pessoais
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nome</label>
            <input
              type="text"
              defaultValue={profile.first_name}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Sobrenome</label>
            <input
              type="text"
              defaultValue={profile.last_name}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              disabled
              className="rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground-secondary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">WhatsApp</label>
            <div className="flex gap-2">
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="w-[100px] shrink-0 rounded-xl border border-border bg-background px-2 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                {DIAL_CODES.map((d) => (
                  <option key={d.dial} value={d.dial}>
                    {d.flag} {d.dial}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                defaultValue={profile.whatsapp ?? ""}
                placeholder="11 99999-9999"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
          Endereço
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium">País</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium">Rua</label>
            <input
              type="text"
              defaultValue={profile.address_street ?? ""}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Cidade</label>
            <input
              type="text"
              defaultValue={profile.address_city ?? ""}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">{countryInfo.postalLabel}</label>
            <input
              type="text"
              defaultValue={profile.address_postal_code ?? ""}
              placeholder={countryInfo.postalPlaceholder}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
          Conexão Instagram
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584]">
            <AtSign size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {instagramConnected ? instagramUsername : "Não conectado"}
            </p>
            <p className="text-xs text-foreground-secondary">
              {instagramConnected ? "Conta conectada" : "Conecte para começar"}
            </p>
          </div>
          <a
            href="/api/instagram/connect"
            className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-background-secondary"
          >
            {instagramConnected ? "Reconectar" : "Conectar"}
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-error/20 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10">
            <Trash2 size={18} className="text-error" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-error">Excluir conta</h2>
            <p className="text-xs text-foreground-secondary">Permanente e irreversível</p>
          </div>
          <button className="shrink-0 rounded-xl border border-error px-4 py-2 text-sm font-medium text-error hover:bg-error/10">
            Excluir
          </button>
        </div>
      </section>
    </div>
  );
}
