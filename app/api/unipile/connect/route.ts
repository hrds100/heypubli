import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHostedLink } from "@/lib/integrations/unipile";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();

  if (!profile?.is_admin)
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://heypubli.com";

  const { url } = await createHostedLink({
    successUrl: `${appUrl}/admin/mensagens?whatsapp=connected`,
    failureUrl: `${appUrl}/admin/mensagens?whatsapp=failed`,
    notifyUrl: `${appUrl}/api/webhooks/unipile`,
    label: "HeyPubli WhatsApp",
  });

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("channels") as any).insert({
    type: "whatsapp",
    status: "disconnected",
  });

  return NextResponse.json({ url });
}
