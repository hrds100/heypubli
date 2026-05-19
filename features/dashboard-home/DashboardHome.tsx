import Image from "next/image";
import type { Profile, Brand } from "@/types/database";

const TIERS = [
  {
    name: "Iniciante",
    threshold: 0,
    products: [{ alt: "ScanPlates", logo: "/brands/scanplates.svg" }],
  },
  {
    name: "Crescimento",
    threshold: 10,
    products: [
      { alt: "FitBoost", logo: "/brands/fitboost.svg" },
      { alt: "GlowSkin", logo: "/brands/glowskin.svg" },
      { alt: "NutriVida", logo: "/brands/nutrivida.svg" },
    ],
  },
  {
    name: "Profissional",
    threshold: 50,
    products: [
      { alt: "TechWear", logo: "/brands/techwear.svg" },
      { alt: "PetLove", logo: "/brands/petlove.svg" },
      { alt: "EcoHome", logo: "/brands/ecohome.svg" },
      { alt: "BelaFlor", logo: "/brands/belaflor.svg" },
    ],
  },
  {
    name: "VIP",
    threshold: 200,
    products: [
      { alt: "LuxBrand", logo: "/brands/luxbrand.svg" },
      { alt: "Premium+", logo: "/brands/premium.svg" },
      { alt: "Elite", logo: "/brands/elite.svg" },
      { alt: "Diamond", logo: "/brands/diamond.svg" },
      { alt: "Exclusive", logo: "/brands/exclusive.svg" },
    ],
  },
];

export interface InstagramData {
  username: string;
  name?: string;
  biography?: string;
  profilePictureUrl?: string;
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  accountType: string;
  isConnected: boolean;
}

interface DashboardHomeProps {
  profile: Profile;
  activeBrands: Brand[];
  instagram: InstagramData | null;
}

function InstagramCard({ ig }: { ig: InstagramData }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-5 py-3">
        <div className="flex items-center gap-2 text-white/90">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span className="text-sm font-medium">Instagram</span>
          <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
            {ig.accountType === "BUSINESS" ? "Business" : "Creator"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {ig.profilePictureUrl ? (
            <Image
              src={ig.profilePictureUrl}
              alt={ig.username}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border-2 border-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-secondary text-xl font-bold text-foreground-secondary">
              {ig.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground truncate">
              {ig.name ?? ig.username}
            </h3>
            <p className="text-sm text-foreground-secondary">@{ig.username}</p>
            {ig.biography && (
              <p className="mt-1 text-xs text-foreground-secondary line-clamp-2 whitespace-pre-line">
                {ig.biography}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {ig.followersCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {ig.followsCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Seguindo</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {ig.mediaCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectAccountCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-secondary">
        <svg
          className="h-5 w-5 text-foreground-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground">Adicione mais perfis</h3>
        <p className="text-xs text-foreground-secondary">
          Quanto mais perfis, mais você ganha
        </p>
      </div>
      <a
        href="/api/instagram/connect"
        className="shrink-0 rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
      >
        Adicionar
      </a>
    </div>
  );
}

function ConnectFirstCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary">
        <svg
          className="h-6 w-6 text-foreground-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h3 className="font-medium text-foreground">Conectar Instagram</h3>
      <p className="mt-1 text-sm text-foreground-secondary">
        Conecte para receber publicações de marcas
      </p>
      <a
        href="/api/instagram/connect"
        className="mt-4 rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
      >
        Conectar meu Instagram
      </a>
    </div>
  );
}

function HotmartSteps({ profile, brands }: { profile: Profile; brands: Brand[] }) {
  const firstBrand = brands[0];
  return (
    <div className="rounded-2xl border border-border p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
        Comece a ganhar
      </h2>

      <div className="mt-4 space-y-0">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              1
            </div>
            <div className="mt-1 h-8 w-0.5 bg-border" />
          </div>
          <div className="flex-1 min-w-0 pb-4">
            <p className="text-sm font-semibold text-foreground">Visite o Hotmart</p>
            <p className="mt-0.5 text-xs text-foreground-secondary">
              Cadastre-se como afiliado de{" "}
              <span className="font-medium text-foreground">
                {firstBrand?.name ?? "sua marca"}
              </span>
            </p>
            {firstBrand?.hotmart_product_url ? (
              <a
                href={firstBrand.hotmart_product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
              >
                Abrir Hotmart
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </a>
            ) : (
              <p className="mt-1 text-xs text-foreground-secondary/70">
                Link disponível em breve
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              2
            </div>
            <div className="mt-1 h-8 w-0.5 bg-border" />
          </div>
          <div className="flex-1 min-w-0 pb-4">
            <p className="text-sm font-semibold text-foreground">
              Pegue seu link de afiliado
            </p>
            <p className="mt-0.5 text-xs text-foreground-secondary">
              Copie o link que o Hotmart gerar para você
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            3
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Cole seu link aqui</p>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                placeholder="https://hotmart.com/affiliate/seu-link"
                defaultValue={profile.hotmart_url ?? ""}
                className="flex-1 rounded-lg border border-border bg-background-secondary/50 px-3 py-2 text-sm focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90">
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TiersSection() {
  const currentSales = 7;

  const nextLocked = TIERS.find((t) => currentSales < t.threshold);
  const nextThreshold = nextLocked?.threshold ?? 200;
  const remaining = Math.max(nextThreshold - currentSales, 0);
  const progressPercent =
    nextThreshold > 0 ? Math.min((currentSales / nextThreshold) * 100, 100) : 100;

  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
          Seus produtos
        </h2>
        <span className="rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-3 py-1 text-xs font-bold text-white">
          {currentSales} vendas
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-foreground-secondary">
          <span>
            {nextLocked ? `Próximo nível: ${nextLocked.name}` : "Todos desbloqueados!"}
          </span>
          <span className="font-medium">
            {currentSales}/{nextThreshold}
          </span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-background-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {remaining > 0 && (
          <p className="mt-2 text-xs text-foreground-secondary">
            Faltam <span className="font-bold text-accent">{remaining} vendas</span> para
            desbloquear {nextLocked?.name}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {TIERS.map((tier) => {
          const isUnlocked = currentSales >= tier.threshold;

          return (
            <div key={tier.name}>
              <div className="flex items-center gap-2.5">
                {isUnlocked ? (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <svg
                      className="h-3 w-3 text-accent/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                )}
                <span
                  className={`text-sm font-semibold ${isUnlocked ? "text-foreground" : "text-foreground-secondary"}`}
                >
                  {tier.name}
                </span>
                {tier.name === "VIP" && (
                  <span className="rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-2 py-0.5 text-[10px] font-bold text-white">
                    EXCLUSIVO
                  </span>
                )}
                <span
                  className={`ml-auto text-xs ${isUnlocked ? "font-semibold text-success" : "text-foreground-secondary"}`}
                >
                  {isUnlocked ? "Desbloqueado" : `${tier.threshold} vendas`}
                </span>
              </div>

              <div className="ml-8 mt-2 flex flex-wrap gap-2">
                {tier.products.map((product) => (
                  <div
                    key={product.alt}
                    className={`overflow-hidden rounded-lg border bg-white px-1.5 py-1 transition-all ${
                      isUnlocked
                        ? "border-border shadow-sm"
                        : "border-border/40 opacity-35 grayscale"
                    }`}
                  >
                    <Image
                      src={product.logo}
                      alt={product.alt}
                      width={140}
                      height={40}
                      className="h-9 w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardHome({ profile, activeBrands, instagram }: DashboardHomeProps) {
  return (
    <div className="space-y-5 p-6">
      <h1 className="text-2xl font-bold">
        Olá, {profile.first_name}! Bem-vindo à HeyPubli
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          {instagram?.isConnected ? (
            <>
              <InstagramCard ig={instagram} />
              <ConnectAccountCard />
            </>
          ) : (
            <ConnectFirstCard />
          )}

          <HotmartSteps profile={profile} brands={activeBrands} />
        </div>

        {/* Right column — Gamification */}
        <div>
          <TiersSection />
        </div>
      </div>
    </div>
  );
}
