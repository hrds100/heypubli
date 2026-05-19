import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { connectWhatsApp } from "@/lib/integrations/unipile";

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

  try {
    const { account_id, qrCodeString, code } = await connectWhatsApp();

    if (!qrCodeString) {
      return NextResponse.json(
        { error: "Unipile não retornou QR code. Tente novamente." },
        { status: 502 },
      );
    }

    const qrDataUrl = await QRCode.toDataURL(qrCodeString, {
      width: 280,
      margin: 2,
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
    });

    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("channels") as any).insert({
      type: "whatsapp",
      status: "disconnected",
      unipile_account_id: account_id || null,
      label: "Aguardando scan...",
    });

    return NextResponse.json({ qrDataUrl, accountId: account_id, code });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao conectar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
