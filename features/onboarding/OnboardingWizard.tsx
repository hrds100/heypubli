"use client";

import { useState } from "react";
import type { Sector } from "@/types/database";
import { StepIndicator } from "./StepIndicator";
import { SectorGrid } from "./SectorGrid";
import { onboardingCopy } from "./copy";

interface OnboardingWizardProps {
  sectors: Sector[];
  userName: string;
}

export function OnboardingWizard({ sectors, userName }: OnboardingWizardProps) {
  const [step, setStep] = useState(2);
  const [preferredSectors, setPreferredSectors] = useState<string[]>([]);
  const [contentTopics, setContentTopics] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    date_of_birth: "",
    gender: "",
    address_street: "",
    address_city: "",
    address_postal_code: "",
    phone: "",
  });

  const canAdvance = () => {
    switch (step) {
      case 2:
        return true;
      case 3:
        return preferredSectors.length >= 3;
      case 4:
        return contentTopics.length >= 1;
      case 5:
        return profile.date_of_birth && profile.gender && profile.phone;
      default:
        return true;
    }
  };

  const toggleSector = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter((s) => s !== id) : [...list, id]);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      <StepIndicator currentStep={step} totalSteps={6} />

      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">{onboardingCopy.step2.title}</h2>
          <p className="text-foreground-secondary">{onboardingCopy.step2.transparency}</p>
          <button
            onClick={() => setStep(3)}
            className="rounded-full bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent/90"
          >
            {onboardingCopy.step2.connectButton}
          </button>
          <button
            onClick={() => setStep(3)}
            className="block mx-auto text-sm text-foreground-secondary hover:underline"
          >
            {onboardingCopy.step2.skip}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{onboardingCopy.step3.title}</h2>
          <SectorGrid
            sectors={sectors}
            selected={preferredSectors}
            onToggle={(id) => toggleSector(id, preferredSectors, setPreferredSectors)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{onboardingCopy.step4.title}</h2>
          <p className="text-foreground-secondary">{onboardingCopy.step4.subtitle}</p>
          <SectorGrid
            sectors={sectors}
            selected={contentTopics}
            onToggle={(id) => toggleSector(id, contentTopics, setContentTopics)}
            min={1}
            max={8}
          />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Prazer em te conhecer, {userName}! Conta mais sobre você
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Data de nascimento</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) =>
                  setProfile({ ...profile, date_of_birth: e.target.value })
                }
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Gênero</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="male">Homem</option>
                <option value="female">Mulher</option>
                <option value="non_binary">Não-binário</option>
                <option value="undisclosed">Prefiro não dizer</option>
              </select>
              <p className="text-xs text-foreground-secondary">
                Saber seu gênero nos permite oferecer campanhas personalizadas
              </p>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium">Endereço</label>
              <input
                type="text"
                placeholder="Rua"
                value={profile.address_street}
                onChange={(e) =>
                  setProfile({ ...profile, address_street: e.target.value })
                }
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Cidade</label>
              <input
                type="text"
                value={profile.address_city}
                onChange={(e) => setProfile({ ...profile, address_city: e.target.value })}
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">CEP</label>
              <input
                type="text"
                value={profile.address_postal_code}
                onChange={(e) =>
                  setProfile({ ...profile, address_postal_code: e.target.value })
                }
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium">Celular</label>
              <input
                type="tel"
                placeholder="+55 11 99999-9999"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          <p className="text-xs text-foreground-secondary">
            Por que pedimos endereço: para receber produtos das colaborações.
          </p>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-2xl text-white">
            ✓
          </div>
          <h2 className="text-xl font-semibold">{onboardingCopy.step6.title}</h2>
          <p className="text-foreground-secondary">{onboardingCopy.step6.subtitle}</p>
          <a
            href="/dashboard"
            className="inline-block rounded-full bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent/90"
          >
            {onboardingCopy.step6.button}
          </a>
        </div>
      )}

      {step >= 3 && step <= 5 && (
        <div className="flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            className="rounded-full border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            Voltar
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
