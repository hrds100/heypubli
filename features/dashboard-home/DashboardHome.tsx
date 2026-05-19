import Image from "next/image";
import type { Profile, Brand } from "@/types/database";

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
  futureBrands: Brand[];
  instagram: InstagramData | null;
}

function InstagramCard({ ig }: { ig: InstagramData }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-6 py-4">
        <div className="flex items-center gap-2 text-white/80">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span className="text-sm font-medium">Instagram</span>
          <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
            {ig.accountType === "BUSINESS" ? "Business" : "Creator"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          {ig.profilePictureUrl ? (
            <Image
              src={ig.profilePictureUrl}
              alt={ig.username}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full border-2 border-border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background-secondary text-2xl font-bold text-foreground-secondary">
              {ig.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              {ig.name ?? ig.username}
            </h3>
            <p className="text-sm text-foreground-secondary">@{ig.username}</p>
            {ig.biography && (
              <p className="mt-1 text-sm text-foreground-secondary whitespace-pre-line">
                {ig.biography}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {ig.followersCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {ig.followsCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Seguindo</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {ig.mediaCount.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-foreground-secondary">Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstagramDisconnected() {
  return (
    <div className="rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-error" />
        <span className="font-medium">Instagram: Pendente</span>
      </div>
      <p className="mt-2 text-sm text-foreground-secondary">
        Conecte seu Instagram para começar a receber publicações de marcas parceiras.
      </p>
      <a
        href="/api/instagram/connect"
        className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] px-6 py-2.5 text-sm font-medium text-white"
      >
        Conectar meu Instagram
      </a>
    </div>
  );
}

export function DashboardHome({
  profile,
  activeBrands,
  futureBrands,
  instagram,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        Olá, {profile.first_name}! Bem-vindo à Hey Publi
      </h1>

      {instagram?.isConnected ? (
        <InstagramCard ig={instagram} />
      ) : (
        <InstagramDisconnected />
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Marcas ativas</h2>
        {activeBrands.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {activeBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-xl border border-border bg-background px-6 py-4 font-medium"
              >
                {brand.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-secondary">
            Nenhuma marca ativa ainda. Em breve você receberá suas primeiras campanhas.
          </p>
        )}
      </div>

      {futureBrands.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground-secondary">
            Marcas que podem te contatar no futuro
          </h2>
          <div className="flex flex-wrap gap-3">
            {futureBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-xl border border-border bg-background-secondary px-6 py-4 font-medium text-foreground-secondary opacity-50"
              >
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold">Seu link Hotmart</h2>
        <div className="mt-3 flex gap-3">
          <input
            type="url"
            placeholder="Cole aqui seu link de afiliado do Hotmart"
            defaultValue={profile.hotmart_url ?? ""}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          <button className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
            Salvar
          </button>
        </div>
        <p className="mt-2 text-xs text-foreground-secondary">
          Próximo passo: vá ao Hotmart, cadastre-se como afiliado, copie seu link e cole
          acima.
        </p>
      </div>
    </div>
  );
}
