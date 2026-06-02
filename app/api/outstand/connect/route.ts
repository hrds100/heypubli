import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPostingSettingsAdmin } from "@/lib/data/outstand";
import { getAuthUrl } from "@/lib/integrations/outstand";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const settings = await getPostingSettingsAdmin();
  if (!settings?.outstand_api_key || !settings?.outstand_social_network_id) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(
      `${origin}/onboarding?ig_error=${encodeURIComponent("Outstand não configurado")}`,
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/auth/outstand/callback`;

  const authUrl = await getAuthUrl(
    settings.outstand_api_key,
    settings.outstand_social_network_id,
    redirectUri,
    user.id,
  );

  return NextResponse.redirect(authUrl);
}
