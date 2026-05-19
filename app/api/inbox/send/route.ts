import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsAppMessage, sendToExistingChat } from "@/lib/integrations/unipile";

export async function POST(req: Request) {
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

  const { conversationId, body } = (await req.json()) as {
    conversationId: string;
    body: string;
  };

  if (!conversationId || !body) {
    return NextResponse.json(
      { error: "conversationId e body são obrigatórios" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: convo } = await admin
    .from("conversations")
    .select("id, profile_id, channel, unipile_chat_id")
    .eq("id", conversationId)
    .single();

  if (!convo)
    return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  // Get connected WhatsApp channel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: channel } = await (admin.from("channels") as any)
    .select("id, unipile_account_id")
    .eq("type", "whatsapp")
    .eq("status", "connected")
    .single();

  if (!(channel as { unipile_account_id: string | null } | null)?.unipile_account_id) {
    return NextResponse.json(
      { error: "Nenhum WhatsApp conectado. Conecte em Configurações." },
      { status: 400 },
    );
  }

  let externalId: string | null = null;

  // If we have a chat_id, send to existing chat; otherwise find the contact's phone
  if ((convo as { unipile_chat_id: string | null }).unipile_chat_id) {
    externalId = await sendToExistingChat(
      (convo as { unipile_chat_id: string }).unipile_chat_id,
      body,
    );
  } else {
    // Find contact phone from profile
    const profileId = (convo as { profile_id: string | null }).profile_id;
    if (!profileId) {
      return NextResponse.json({ error: "Sem contato na conversa" }, { status: 400 });
    }

    const { data: contactProfile } = await admin
      .from("profiles")
      .select("whatsapp, phone")
      .eq("id", profileId)
      .single();

    const recipientPhone =
      (contactProfile as { whatsapp: string | null; phone: string | null } | null)
        ?.whatsapp ||
      (contactProfile as { whatsapp: string | null; phone: string | null } | null)?.phone;

    if (!recipientPhone) {
      return NextResponse.json(
        { error: "Contato sem número de WhatsApp" },
        { status: 400 },
      );
    }

    externalId = await sendWhatsAppMessage(
      (channel as { unipile_account_id: string }).unipile_account_id,
      recipientPhone,
      body,
    );
  }

  // Store outbound message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: msg } = await (admin.from("inbox_messages") as any)
    .insert({
      conversation_id: conversationId,
      direction: "outbound",
      sender: "admin",
      body,
      content_type: "text",
      metadata: { external_id: externalId, via: "unipile" },
    })
    .select("id")
    .single();

  // Update conversation preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("conversations") as any)
    .update({
      last_message_at: new Date().toISOString(),
      last_message_preview: body.slice(0, 100),
      unread_count: 0,
    })
    .eq("id", conversationId);

  return NextResponse.json({
    ok: true,
    message_id: (msg as { id: string } | null)?.id,
    external_id: externalId,
  });
}
