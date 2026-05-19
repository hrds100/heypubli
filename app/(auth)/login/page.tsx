import Link from "next/link";
import { LoginForm, TestCredentials } from "@/features/auth-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="mb-4 inline-block text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#C13584] bg-clip-text text-transparent">
              Hey Publi
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
          <p className="mt-1 text-foreground-secondary">Entre na sua conta Hey Publi</p>
        </div>
        <LoginForm />
        <TestCredentials />
        <p className="text-center text-sm text-foreground-secondary">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-accent hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
