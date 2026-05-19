import Link from "next/link";

const BRAND_NAMES = [
  "Natura",
  "O Boticário",
  "Havaianas",
  "Magazine Luiza",
  "Renner",
  "Amaro",
  "Farm",
  "Reserva",
  "Cacau Show",
  "Hotmart",
  "Loja Integrada",
  "Mondaine",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[420px] shrink-0 flex-col bg-background-secondary px-10 py-10 lg:flex">
        <Link href="/">
          <span
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #F56040, #E1306C, #C13584)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hey Publi
          </span>
        </Link>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">
            Essas marcas estão
            <br />
            esperando por você...
          </h2>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {BRAND_NAMES.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-lg border border-border bg-background px-2 py-3 text-center text-xs font-medium text-foreground-secondary"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-sm font-medium text-foreground">Seus dados de acesso</p>
            <p className="mt-1 text-xs text-foreground-secondary">
              Na nossa plataforma, você é único. Ganhe 30% de comissão recorrente por cada
              venda gerada pelo seu link de afiliado.
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-accent" />
            <div className="h-1.5 flex-1 rounded-full bg-border" />
            <div className="h-1.5 flex-1 rounded-full bg-border" />
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
