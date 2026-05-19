import Link from "next/link";
import { SignupForm } from "@/features/auth-form";

export default function CadastroPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-4xl gap-12">
        <div className="hidden flex-1 flex-col justify-center lg:flex">
          <h2 className="text-xl font-semibold text-foreground">
            Essas marcas estão esperando por você...
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-border bg-background-secondary px-6 py-4 font-medium">
              ScanPlates
            </div>
            <div className="rounded-xl border border-border bg-background-secondary px-6 py-4 font-medium text-foreground-secondary opacity-50">
              FitTrack
            </div>
            <div className="rounded-xl border border-border bg-background-secondary px-6 py-4 font-medium text-foreground-secondary opacity-50">
              GlowUp
            </div>
          </div>
          <p className="mt-4 text-sm text-foreground-secondary">
            Ganhe comissão recorrente de 30% por cada venda gerada pelo seu link de
            afiliado.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
            <p className="mt-1 text-foreground-secondary">
              Comece a ganhar com suas redes sociais
            </p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-foreground-secondary">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
