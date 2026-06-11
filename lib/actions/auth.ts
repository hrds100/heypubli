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
  const host = h.get("host") ?? "www.nextpubli.com";
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

// Fallback login path: the user types the 6-digit code from the magic-link email.
// Survives everything that kills the link — scanners consuming it, broken email
// clients, opening on another device. Same one-time token, typed by a human.
export async function verifyLoginCode(
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code = (formData.get("code") as string)?.trim().replace(/\s+/g, "");

  if (!email || !email.includes("@")) {
    return { error: "Informe um email válido" };
  }
  // GoTrue is the authority on the exact code — we only sanity-check the shape.
  // Lenient range so a future mailer_otp_length change can't lock anyone out.
  if (!code || !/^\d{6,10}$/.test(code)) {
    return { error: "Informe o código de 8 dígitos do email" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    return {
      error:
        "Código inválido ou expirado. Use o código do email mais recente ou peça um novo.",
    };
  }

  let isAdmin = false;
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single<{ is_admin: boolean }>();
    isAdmin = profile?.is_admin ?? false;
  }

  redirect(isAdmin ? "/admin" : "/dashboard");
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
    return { error: "Email ou senha incorretos." };
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
