import Link from "next/link";
import { IgLoginButton, igLoginCopy } from "@/features/ig-login";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <Link href="/" className="lg:hidden mb-6 inline-block">
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
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
        <p className="mt-2 text-foreground-secondary">
          Entre com a sua conta do Instagram
        </p>
      </div>

      {erro && (
        <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{erro}</div>
      )}

      <IgLoginButton label={igLoginCopy.defaultLabel} />

      <p className="text-xs text-foreground-secondary">
        Use uma conta Profissional do Instagram (Criador ou Empresa). É grátis trocar nas
        configurações do Instagram.
      </p>
    </div>
  );
}
