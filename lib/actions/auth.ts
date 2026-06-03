"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Returning influencers log in with an email magic link (no Instagram re-auth).
// We email a one-time login link to the address on their account.
export async function sendLoginLink(
  formData: FormData,
): Promise<{ sent?: boolean; email?: string; error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Informe um email válido" };
  }

  const h = await headers();
  const host = h.get("host") ?? "www.heypubli.com";
  const proto = host.includes("localhost") ? "http" : "https";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${proto}://${host}/auth/callback`,
      shouldCreateUser: false, // only existing accounts; sign-up is via Instagram
    },
  });

  if (error) {
    return {
      error: "Não foi possível enviar o link. Verifique o email e tente novamente.",
    };
  }
  return { sent: true, email };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/onboarding");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .single<{ is_admin: boolean }>();

  redirect(profile?.is_admin ? "/admin" : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
