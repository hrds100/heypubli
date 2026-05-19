import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getInstagramAuthUrl } from "@/lib/integrations/instagram";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/auth/instagram/callback`;
  const authUrl = getInstagramAuthUrl(redirectUri);

  return NextResponse.redirect(authUrl);
}
