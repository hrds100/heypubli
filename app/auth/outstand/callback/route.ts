import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPendingConnection, finalizeConnection } from "@/lib/integrations/outstand";
import { saveOutstandConnection } from "@/lib/data/outstand";
import { findOrCreateInfluencerByOutstand, type IgSignupData } from "@/lib/data/auth-ig";

const STATE_COOKIE = "ig_login_state";
const SIGNUP_COOKIE = "ig_signup_data";

function readSignupData(raw: string | undefined): IgSignupData | undefined {
  if (!raw) return undefined;
  try {
    const d = JSON.parse(raw);
    if (d?.first_name && d?.last_name && d?.email && d?.whatsapp) {
      return {
        firstName: d.first_name,
        lastName: d.last_name,
        email: d.email,
        whatsapp: d.whatsapp,
      };
    }
  } catch {
    // ignore malformed cookie
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const session = searchParams.get("session");
  const error = searchParams.get("error");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();

  // Already signed in → connecting/reconnecting from inside the app (errors → onboarding).
  // Not signed in → logging in / signing up with Instagram (errors → login page).
  const errBase = user ? `${origin}/onboarding` : `${origin}/login`;
  const errKey = user ? "ig_error" : "erro";
  const fail = (msg: string) => {
    if (!user) {
      cookieStore.delete(STATE_COOKIE);
      cookieStore.delete(SIGNUP_COOKIE);
    }
    return NextResponse.redirect(`${errBase}?${errKey}=${encodeURIComponent(msg)}`);
  };

  if (error || !session) {
    return fail("Conexão com o Instagram cancelada");
  }

  // For the login/sign-up flow, validate the CSRF nonce BEFORE consuming the one-time
  // Outstand session token, so a forged callback can't trigger a login.
  if (!user) {
    const expectedState = cookieStore.get(STATE_COOKIE)?.value;
    const returnedState = searchParams.get("tenant_id") ?? searchParams.get("state");
    if (!expectedState || (returnedState && returnedState !== expectedState)) {
      return fail("Sua sessão de login expirou. Tente novamente.");
    }
  }

  try {
    const pending = await getPendingConnection(session);
    const pageIds = pending.availablePages.map((p) => p.id);
    if (pageIds.length === 0) {
      return fail("Nenhuma conta do Instagram encontrada");
    }

    const accounts = await finalizeConnection(session, pageIds);
    if (accounts.length === 0) {
      return fail("Não foi possível conectar a conta do Instagram");
    }
    const account = accounts[0];

    // --- Connect flow (user already authenticated) ---
    if (user) {
      await saveOutstandConnection(user.id, account.id, account.username);
      return NextResponse.redirect(`${origin}/onboarding?ig_connected=true`);
    }

    // --- Login / sign-up flow ---
    const signup = readSignupData(cookieStore.get(SIGNUP_COOKIE)?.value);
    const { email, isNew } = await findOrCreateInfluencerByOutstand(
      { socialAccountId: account.id, username: account.username },
      signup,
    );

    // Mint a Supabase session without a password: admin magic link → verify it here.
    const admin = createAdminClient();
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const tokenHash = link?.properties?.hashed_token;
    if (linkErr || !tokenHash) {
      throw new Error(linkErr?.message ?? "Falha ao iniciar a sessão");
    }
    const { error: otpErr } = await supabase.auth.verifyOtp({
      type: "magiclink",
      token_hash: tokenHash,
    });
    if (otpErr) throw new Error(otpErr.message);

    cookieStore.delete(STATE_COOKIE);
    cookieStore.delete(SIGNUP_COOKIE);
    // Sign-up (data already collected) → onboarding. Returning influencer → dashboard.
    // New influencer via the login button (no data) → /bem-vindo to capture contact.
    // (middleware also enforces the needs_contact gate.)
    const dest = !isNew ? "/dashboard" : signup ? "/onboarding" : "/bem-vindo";
    return NextResponse.redirect(`${origin}${dest}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao entrar com o Instagram";
    return fail(message);
  }
}
