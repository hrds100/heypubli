import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Stateless magic-link verification (token_hash + verifyOtp).
//
// Unlike the PKCE `code` flow in /auth/callback — which needs the code-verifier
// cookie set in the SAME browser that requested the link — this flow carries the
// one-time token in the URL itself. That means a link requested on one browser can
// be opened in another (e.g. a phone email app's in-app browser) and still work.
// The Supabase magic-link email template points here.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Only allow same-origin relative redirects to avoid open-redirect abuse.
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      // Session cookie is set → middleware routes admins / unfinished onboarding.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?erro=${encodeURIComponent("Link inválido ou expirado. Tente novamente.")}`,
  );
}
