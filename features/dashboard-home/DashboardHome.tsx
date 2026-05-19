import type { Profile, Brand } from "@/types/database";

interface DashboardHomeProps {
  profile: Profile;
  activeBrands: Brand[];
  futureBrands: Brand[];
  instagramConnected: boolean;
}

export function DashboardHome({
  profile,
  activeBrands,
  futureBrands,
  instagramConnected,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        Olá, {profile.first_name}! Bem-vindo à Hey Publi
      </h1>

      <div className="rounded-xl border border-border bg-background-secondary p-6">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${instagramConnected ? "bg-success" : "bg-error"}`}
          />
          <span className="font-medium">
            Instagram: {instagramConnected ? "Conectado" : "Pendente"}
          </span>
        </div>
        <p className="mt-2 text-sm text-foreground-secondary">
          Nós gerenciamos sua conta. A cada 72h postamos no feed e a cada 48h nos stories
          sobre marcas parceiras.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Marcas ativas</h2>
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
          Próximo passo: vá ao Hotmart, cadastre-se como afiliado do ScanPlates, copie seu
          link e cole acima.
        </p>
      </div>
    </div>
  );
}
