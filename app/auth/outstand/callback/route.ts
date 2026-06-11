import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSocialAccountByTenant } from "@/lib/integrations/outstand";
import { saveOutstandConnection, getPostingSettingsAdmin } from "@/lib/data/outstand";
import { findOrCreateInfluencerByOutstand, type IgSignupData } from "@/lib/data/auth-ig";
import { notifyAccountConnected } from "@/lib/data/notifications";
import { STATE_COOKIE, SIGNUP_COOKIE, authCookieClearAttrs } from "@/lib/ig-auth-cookies";

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
  const error = searchParams.get("error");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();

  // Deletions must repeat the Domain/Path the cookies were set with, or the
  // browser treats them as different cookies and keeps the originals.
  const clearAttrs = authCookieClearAttrs(origin);
  const clearStateCookie = () =>
    cookieStore.delete({ name: STATE_COOKIE, ...clearAttrs });
  const clearSignupCookie = () =>
    cookieStore.delete({ name: SIGNUP_COOKIE, ...clearAttrs });

  const hadSignupData = Boolean(cookieStore.get(SIGNUP_COOKIE)?.value);

  // Already signed in → connecting from inside the app (errors → onboarding).
  // Mid-SIGNUP (form data present) → back to /cadastro so they can retry there.
  // Otherwise → login page.
  const errBase = user
    ? `${origin}/onboarding`
    : hadSignupData
      ? `${origin}/cadastro`
      : `${origin}/login`;
  const errKey = user ? "ig_error" : "erro";
  const fail = (msg: string) => {
    if (!user) {
      // Keep the signup-data cookie so /cadastro can prefill the form on retry.
      clearStateCookie();
    }
    return NextResponse.redirect(`${errBase}?${errKey}=${encodeURIComponent(msg)}`);
  };

  if (error) {
    return fail("Conexão com o Instagram cancelada");
  }

  // The tenant_id we passed to Outstand when starting the OAuth:
  //  - connect (logged in):     the user's id
  //  - sign-up (not logged in): the random state nonce stored in the cookie
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;
  if (!user) {
    // NOTE: only tenant_id can echo our nonce — Outstand uses `state` for its
    // own org id, so comparing against it would reject every signup.
    const returnedState = searchParams.get("tenant_id");
    if (!expectedState || (returnedState && returnedState !== expectedState)) {
      return fail("Sua sessão de login expirou. Tente novamente.");
    }
  }
  const tenantId = user ? user.id : expectedState;
  if (!tenantId) {
    return fail("Sua sessão de login expirou. Tente novamente.");
  }

  try {
    const settings = await getPostingSettingsAdmin();
    if (!settings?.outstand_api_key) {
      return fail("Integração do Instagram indisponível no momento");
    }

    // Outstand auto-connects the account against tenant_id and redirects back without a
    // session token, so we look the just-connected account up by tenant_id.
    const account = await getSocialAccountByTenant(settings.outstand_api_key, tenantId);
    if (!account) {
      return fail(
        "Login do Instagram não concluído. Tente novamente e conclua a autorização.",
      );
    }

    // --- Connect flow (user already authenticated) ---
    if (user) {
      const { isNew } = await saveOutstandConnection(
        user.id,
        account.id,
        account.username,
        account.igUserId,
      );
      if (isNew) {
        const admin = createAdminClient();
        const { data: prof } = await admin
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle<{ first_name: string; last_name: string }>();
        await notifyAccountConnected({
          profileId: user.id,
          igUsername: account.username,
          name: prof ? `${prof.first_name} ${prof.last_name}`.trim() : account.username,
        });
      }
      return NextResponse.redirect(`${origin}/onboarding?ig_connected=true`);
    }

    // --- Sign-up flow ---
    const signup = readSignupData(cookieStore.get(SIGNUP_COOKIE)?.value);
    const { email, isNew } = await findOrCreateInfluencerByOutstand(
      {
        socialAccountId: account.id,
        username: account.username,
        igUserId: account.igUserId,
      },
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

    clearStateCookie();
    clearSignupCookie();
    // Sign-up (data already collected) → onboarding. Returning influencer → dashboard.
    // New influencer via the login button (no data) → /bem-vindo to capture contact.
    const dest = !isNew ? "/dashboard" : signup ? "/onboarding" : "/bem-vindo";
    return NextResponse.redirect(`${origin}${dest}`);
  } catch (err) {
    // Log the real cause for debugging; the user gets actionable PT-BR, never
    // a raw English database/API message.
    console.error("[outstand/callback]", err);
    return fail("Não foi possível entrar com o Instagram. Tente novamente.");
  }
}
