import Link from "next/link";
import { IgSignupForm } from "@/features/ig-login";

export default async function CadastroPage({
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
        <h1 className="text-3xl font-bold text-foreground">Crie sua conta</h1>
        <p className="mt-2 text-foreground-secondary">
          Comece a ganhar com o seu Instagram
        </p>
      </div>

      {erro && (
        <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{erro}</div>
      )}

      <IgSignupForm />

      <p className="text-xs text-foreground-secondary">
        Use uma conta Profissional do Instagram (Criador ou Empresa).{" "}
        <a
          href="https://www.instagram.com/accounts/convert_to_professional_account/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          Ativar agora
        </a>{" "}
        — é grátis.
      </p>

      <p className="text-sm text-foreground-secondary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
