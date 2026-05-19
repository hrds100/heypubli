"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Sector } from "@/types/database";
import { StepIndicator } from "./StepIndicator";
import { SectorGrid } from "./SectorGrid";
import { onboardingCopy } from "./copy";
import { ChevronLeft, Check } from "lucide-react";

interface OnboardingWizardProps {
  sectors: Sector[];
  userName: string;
}

export function OnboardingWizard({ sectors, userName }: OnboardingWizardProps) {
  const searchParams = useSearchParams();
  const igConnected = searchParams.get("ig_connected") === "true";
  const igError = searchParams.get("ig_error");

  const [step, setStep] = useState(igConnected ? 3 : 2);
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
    <div className="flex min-h-screen items-center justify-center bg-background-secondary p-4">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <Link href="/">
            <span
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #F56040, #E1306C, #C13584)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              HeyPubli
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <StepIndicator currentStep={step - 1} totalSteps={5} />

          {step === 2 && (
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {onboardingCopy.step2.title}
                </h2>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {onboardingCopy.step2.transparency}
                </p>
              </div>

              {igError && (
                <p className="text-sm text-error rounded-lg bg-red-50 p-3">
                  {onboardingCopy.step2.error} {igError !== "denied" ? igError : ""}
                </p>
              )}

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Selecione uma rede</p>
                <div className="flex items-center gap-3 rounded-xl border-2 border-accent bg-accent/5 px-4 py-3">
                  <svg
                    className="h-5 w-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="font-medium text-foreground">Instagram</span>
                </div>
              </div>

              <a
                href="/api/instagram/connect"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-6 py-3.5 font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {onboardingCopy.step2.connectButton}
              </a>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="text-sm text-foreground-secondary hover:text-foreground"
                >
                  {onboardingCopy.step2.skip}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Setores preferidos</h2>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {onboardingCopy.step3.title}
                </p>
              </div>
              <SectorGrid
                sectors={sectors}
                selected={preferredSectors}
                onToggle={(id) => toggleSector(id, preferredSectors, setPreferredSectors)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {onboardingCopy.step4.title}
                </h2>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {onboardingCopy.step4.subtitle}
                </p>
              </div>
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
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Prazer em te conhecer, {userName}!
                </h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Conta mais sobre você
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) =>
                      setProfile({ ...profile, date_of_birth: e.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Gênero</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua"
                    value={profile.address_street}
                    onChange={(e) =>
                      setProfile({ ...profile, address_street: e.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Cidade</label>
                    <input
                      type="text"
                      value={profile.address_city}
                      onChange={(e) =>
                        setProfile({ ...profile, address_city: e.target.value })
                      }
                      className="rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">CEP</label>
                    <input
                      type="text"
                      value={profile.address_postal_code}
                      onChange={(e) =>
                        setProfile({ ...profile, address_postal_code: e.target.value })
                      }
                      className="rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Celular</label>
                  <input
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-secondary/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <p className="text-xs text-foreground-secondary">
                Por que pedimos endereço: para receber produtos das colaborações.
              </p>
            </div>
          )}

          {step === 6 && (
            <div className="mt-8 space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success">
                <Check size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {onboardingCopy.step6.title}
                </h2>
                <p className="mt-2 text-foreground-secondary">
                  {onboardingCopy.step6.subtitle}
                </p>
              </div>
              <a
                href="/dashboard"
                className="inline-block rounded-xl bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-8 py-3.5 font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                {onboardingCopy.step6.button}
              </a>
            </div>
          )}

          {step >= 3 && step <= 5 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canAdvance()}
                className="rounded-xl bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-8 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 5 ? "Finalizar" : "Próximo"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
