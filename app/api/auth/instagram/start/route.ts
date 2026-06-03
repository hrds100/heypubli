import { NextResponse } from "next/server";
import { getPostingSettingsAdmin } from "@/lib/data/outstand";
import { getAuthUrl } from "@/lib/integrations/outstand";
import { igSignupSchema } from "@/schemas";

const STATE_COOKIE = "ig_login_state";
const SIGNUP_COOKIE = "ig_signup_data";

async function outstandAuthUrl(origin: string, state: string): Promise<string | null> {
  const settings = await getPostingSettingsAdmin();
  if (!settings?.outstand_api_key || !settings?.outstand_social_network_id) {
    return null;
  }
  try {
    return await getAuthUrl(
      settings.outstand_api_key,
      settings.outstand_social_network_id,
      `${origin}/auth/outstand/callback`,
      state,
    );
  } catch {
    return null;
  }
}

// Short-lived, single-use CSRF nonce. We bind it to the browser via the cookie and
// reject mismatches if Outstand echoes the state back (tenant_id/state) on the
// callback. NOTE: if Outstand does NOT echo it, this degrades to cookie-presence —
// the short TTL limits the login-CSRF window. To fully bind, confirm via one real
// callback whether Outstand echoes tenant_id, then make the callback check require it.
const STATE_TTL_SECONDS = 300;

// Share the auth cookies across apex + www so they survive the heypubli.com → www
// redirect that happens mid-flow — otherwise the sign-up data (incl. the name) is lost.
function cookieDomain(origin: string): string | undefined {
  try {
    const host = new URL(origin).hostname;
    if (host === "heypubli.com" || host.endsWith(".heypubli.com")) {
      return ".heypubli.com";
    }
  } catch {
    // ignore
  }
  return undefined;
}

function authCookieOptions(origin: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: STATE_TTL_SECONDS,
    path: "/",
    domain: cookieDomain(origin),
  };
}

function withStateCookie(res: NextResponse, state: string, origin: string) {
  res.cookies.set(STATE_COOKIE, state, authCookieOptions(origin));
}

// GET — "Sign in with Instagram" for returning influencers (no data collected).
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const state = crypto.randomUUID();
  const authUrl = await outstandAuthUrl(origin, state);
  if (!authUrl) {
    return NextResponse.redirect(
      `${origin}/login?erro=${encodeURIComponent("Login com Instagram indisponível no momento")}`,
    );
  }
  const res = NextResponse.redirect(authUrl);
  withStateCookie(res, state, origin);
  return res;
}

// POST — sign-up: collect name + email + WhatsApp FIRST, stash it, then go to Instagram.
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const form = await request.formData();

  const parsed = igSignupSchema.safeParse({
    first_name: form.get("first_name"),
    last_name: form.get("last_name"),
    email: form.get("email"),
    whatsapp: form.get("whatsapp"),
  });
  const back = (msg: string) =>
    NextResponse.redirect(`${origin}/cadastro?erro=${encodeURIComponent(msg)}`, 303);

  if (form.get("terms") !== "on") {
    return back("Você precisa aceitar os Termos de Uso");
  }
  if (!parsed.success) {
    return back(parsed.error.issues[0]?.message ?? "Preencha todos os campos");
  }

  const state = crypto.randomUUID();
  const authUrl = await outstandAuthUrl(origin, state);
  if (!authUrl) {
    return back("Cadastro com Instagram indisponível no momento");
  }

  const res = NextResponse.redirect(authUrl, 303);
  withStateCookie(res, state, origin);
  // Carried across the Instagram round-trip; consumed (and cleared) by the callback.
  res.cookies.set(SIGNUP_COOKIE, JSON.stringify(parsed.data), authCookieOptions(origin));
  return res;
}
