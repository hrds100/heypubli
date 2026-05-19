import Image from "next/image";
import type { Profile, Brand } from "@/types/database";

const UPCOMING_BRANDS = ["Coca-Cola", "Natura", "Nestlé", "Nike", "Samsung", "L'Oréal"];

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

function ConnectAccountCard({ hasExisting }: { hasExisting: boolean }) {
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
      <h3 className="font-medium text-foreground">
        {hasExisting ? "Adicione mais perfis" : "Conectar Instagram"}
      </h3>
      <p className="mt-1 text-sm text-foreground-secondary">
        {hasExisting
          ? "Quanto mais perfis você adicionar, mais você pode ganhar"
          : "Conecte para receber publicações de marcas"}
      </p>
      <a
        href="/api/instagram/connect"
        className="mt-4 rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-accent/25"
      >
        {hasExisting ? "Adicionar perfil" : "Conectar meu Instagram"}
      </a>
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
      {brand.logo_url ? (
        <Image
          src={brand.logo_url}
          alt={brand.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
          {brand.name[0]}
        </div>
      )}
      <span className="font-medium">{brand.name}</span>
    </div>
  );
}

function HotmartSection({ profile, brands }: { profile: Profile; brands: Brand[] }) {
  const firstBrand = brands[0];
  return (
    <div className="max-w-xl rounded-2xl border border-border p-6">
      <h2 className="text-lg font-semibold">Seu link Hotmart</h2>

      <div className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            1
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Marca ativa: {firstBrand?.name ?? "Aguardando marca"}
            </p>
            <p className="text-xs text-foreground-secondary">
              Cadastre-se como afiliado desta marca no Hotmart
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            2
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Pegue seu link de afiliado
            </p>
            {firstBrand?.hotmart_product_url ? (
              <a
                href={firstBrand.hotmart_product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                Clique aqui para ir ao Hotmart
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
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : (
              <p className="mt-1 text-xs text-foreground-secondary">
                Link do produto será disponibilizado em breve
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            3
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Cole seu link aqui</p>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                placeholder="https://hotmart.com/affiliate/seu-link"
                defaultValue={profile.hotmart_url ?? ""}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardHome({ profile, activeBrands, instagram }: DashboardHomeProps) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        Olá, {profile.first_name}! Bem-vindo à Hey Publi
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {instagram?.isConnected ? (
          <>
            <InstagramCard ig={instagram} />
            <ConnectAccountCard hasExisting={true} />
          </>
        ) : (
          <div className="lg:col-span-2">
            <ConnectAccountCard hasExisting={false} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Marcas ativas</h2>
        <div className="flex flex-wrap items-center gap-3">
          {activeBrands.length > 0 ? (
            activeBrands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
          ) : (
            <p className="text-sm text-foreground-secondary">
              Nenhuma marca ativa ainda. Em breve você receberá suas primeiras campanhas.
            </p>
          )}
          {UPCOMING_BRANDS.map((name) => (
            <div
              key={name}
              className="flex h-[58px] items-center rounded-xl border border-dashed border-border bg-background-secondary/50 px-4 opacity-40"
            >
              <span className="text-sm font-medium text-foreground-secondary">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <HotmartSection profile={profile} brands={activeBrands} />
    </div>
  );
}
