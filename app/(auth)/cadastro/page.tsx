import Link from "next/link";
import { SignupForm } from "@/features/auth-form";

export default function CadastroPage() {
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
          Comece a ganhar com suas redes sociais
        </p>
      </div>

      <SignupForm />

      <p className="text-sm text-foreground-secondary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
