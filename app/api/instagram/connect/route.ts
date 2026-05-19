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

  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;
  const authUrl = getInstagramAuthUrl(redirectUri);

  return NextResponse.redirect(authUrl);
}
