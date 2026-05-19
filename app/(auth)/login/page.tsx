import Link from "next/link";
import { LoginForm, TestCredentials } from "@/features/auth-form";

export default function LoginPage() {
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
        <p className="mt-2 text-foreground-secondary">Entre na sua conta HeyPubli</p>
      </div>

      <LoginForm />

      <TestCredentials />

      <p className="text-sm text-foreground-secondary">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-accent hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
