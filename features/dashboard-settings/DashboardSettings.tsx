"use client";

import { AtSign, Trash2 } from "lucide-react";
import type { Profile, Sector } from "@/types/database";

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
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Dados pessoais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">Nome</label>
            <input
              type="text"
              defaultValue={profile.first_name}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">
              Sobrenome
            </label>
            <input
              type="text"
              defaultValue={profile.last_name}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">
              WhatsApp
            </label>
            <input
              type="tel"
              defaultValue={profile.whatsapp ?? ""}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Endereço</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-foreground-secondary">Rua</label>
            <input
              type="text"
              defaultValue={profile.address_street ?? ""}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">
              Cidade
            </label>
            <input
              type="text"
              defaultValue={profile.address_city ?? ""}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">CEP</label>
            <input
              type="text"
              defaultValue={profile.address_postal_code ?? ""}
              className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Conexão Instagram</h2>
        <div className="flex items-center gap-4">
          <AtSign size={24} className="text-accent" />
          <div>
            <p className="font-medium">
              {instagramConnected ? instagramUsername : "Não conectado"}
            </p>
            <p className="text-sm text-foreground-secondary">
              {instagramConnected
                ? "Conectado — clique para reconectar"
                : "Conecte seu Instagram para começar"}
            </p>
          </div>
          <button className="ml-auto rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background-secondary">
            {instagramConnected ? "Reconectar" : "Conectar"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-error/20 p-6">
        <div className="flex items-center gap-3">
          <Trash2 size={20} className="text-error" />
          <div>
            <h2 className="font-semibold text-error">Excluir conta</h2>
            <p className="text-sm text-foreground-secondary">
              Esta ação é permanente e não pode ser desfeita.
            </p>
          </div>
          <button className="ml-auto rounded-lg border border-error px-4 py-2 text-sm font-medium text-error hover:bg-error/10">
            Excluir minha conta
          </button>
        </div>
      </section>
    </div>
  );
}
