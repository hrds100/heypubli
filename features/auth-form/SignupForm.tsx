"use client";

import { signUp } from "@/lib/actions/auth";
import { useActionState } from "react";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await signUp(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      {state?.error && (
        <p className="text-error text-sm rounded-lg bg-red-50 p-3">{state.error}</p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="first_name" className="text-sm font-medium text-foreground">
          Nome
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          className="rounded-lg border border-border px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="last_name" className="text-sm font-medium text-foreground">
          Sobrenome
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          className="rounded-lg border border-border px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-border px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Senha
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-border px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <p className="text-xs text-foreground-secondary">
          Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
