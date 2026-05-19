import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAccount, toE164 } from "@/lib/integrations/unipile";

const WEBHOOK_SECRET = process.env.UNIPILE_WEBHOOK_SECRET || "";

function ok(note: string) {
  return NextResponse.json({ ok: true, note });
}

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return ok("invalid json");
  }

  const looksLikeHostedNotify =
    typeof payload.status === "string" ||
    (payload.account_id && payload.name && !payload.event);

  if (!looksLikeHostedNotify && WEBHOOK_SECRET) {
    const got = req.headers.get("unipile-auth") || req.headers.get("Unipile-Auth") || "";
    if (got !== WEBHOOK_SECRET) return ok("bad auth");
  }

  const admin = createAdminClient();

  // Branch 1: Account connected (hosted-auth callback)
  if (
    payload.status === "CREATION_SUCCESS" ||
    payload.status === "OK" ||
    (payload.account_id && payload.name && !payload.event)
  ) {
    const accountId = payload.account_id;
    if (!accountId) return ok("no account_id");

    const acct = await fetchAccount(accountId);
    const phone = toE164(acct?.phone ?? "");

    // Try to find channel by account_id first (native QR flow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: byAccountId } = await (admin.from("channels") as any)
      .select("id")
      .eq("unipile_account_id", accountId)
      .eq("type", "whatsapp")
      .limit(1)
      .maybeSingle();

    if (byAccountId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin.from("channels") as any)
        .update({
          status: "connected",
          connected_at: new Date().toISOString(),
          label: phone || null,
          config: { phone, type: acct?.type },
        })
        .eq("id", (byAccountId as { id: string }).id);
      return ok("account_connected");
    }

    // Fallback: find disconnected channel without account_id (hosted flow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pending } = await (admin.from("channels") as any)
      .select("id")
      .eq("type", "whatsapp")
      .eq("status", "disconnected")
      .is("unipile_account_id", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pending) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin.from("channels") as any)
        .update({
          status: "connected",
          unipile_account_id: accountId,
          connected_at: new Date().toISOString(),
          label: phone || null,
          config: { phone, type: acct?.type },
        })
        .eq("id", (pending as { id: string }).id);
    }

    return ok("account_connected");
  }

  // Branch 1b: Account status change
  if (payload.event === "account_status" || payload.account_status) {
    const statusData = payload.account_status || payload;
    const accountId = statusData.account_id || payload.account_id;
    const newStatus = statusData.status || "";

    if (accountId) {
      const isOk = newStatus === "OK" || newStatus === "CREATION_SUCCESS";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin.from("channels") as any)
        .update({
          status: isOk ? "connected" : "disconnected",
          ...(isOk ? {} : { disconnected_at: new Date().toISOString() }),
        })
        .eq("unipile_account_id", accountId);
    }

    return ok("account_status");
  }

  // Branch 2: Inbound message
  if (payload.event === "message_received" && payload.account_id) {
    const accountId = payload.account_id;
    const messageText =
      (typeof payload.message === "string" ? payload.message : payload.message?.text) ||
      "";
    const chatId = payload.chat_id || payload.message?.chat_id || "";
    const senderObj = payload.sender || {};
    const senderPhone = toE164(senderObj.identifier || senderObj.provider_id || "");
    const senderName = senderObj.display_name || senderObj.name || "";

    const rawAttachments: Array<{ id: string; type?: string }> =
      payload.attachments || payload.message?.attachments || [];
    const hasAttachments = rawAttachments.length > 0;

    if (!messageText && !hasAttachments) return ok("no text or attachments");

    // Find channel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: channel } = await (admin.from("channels") as any)
      .select("id")
      .eq("unipile_account_id", accountId)
      .eq("status", "connected")
      .single();

    if (!channel) return ok("no channel");

    // Try to match sender phone to an influencer profile
    let profileId: string | null = null;
    if (senderPhone) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: matchedProfile } = await (admin.from("profiles") as any)
        .select("id")
        .or(`whatsapp.eq.${senderPhone},phone.eq.${senderPhone}`)
        .eq("is_admin", false)
        .limit(1)
        .single();
      profileId = (matchedProfile as { id: string } | null)?.id ?? null;
    }

    // Find or create conversation
    let conversationId: string | null = null;

    if (profileId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (admin.from("conversations") as any)
        .select("id")
        .eq("profile_id", profileId)
        .eq("channel", "whatsapp")
        .eq("status", "open")
        .single();

      if (existing) {
        conversationId = (existing as { id: string }).id;
      }
    }

    if (!conversationId && chatId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: byChatId } = await (admin.from("conversations") as any)
        .select("id")
        .eq("unipile_chat_id", chatId)
        .single();
      conversationId = (byChatId as { id: string } | null)?.id ?? null;
    }

    if (!conversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newConvo } = await (admin.from("conversations") as any)
        .insert({
          profile_id: profileId,
          channel: "whatsapp",
          status: "open",
          unipile_chat_id: chatId || null,
        })
        .select("id")
        .single();
      conversationId = (newConvo as { id: string } | null)?.id ?? null;
    }

    if (!conversationId) return ok("conversation failed");

    const contentType =
      hasAttachments && rawAttachments[0]?.type?.includes("image") ? "image" : "text";

    const preview = messageText.slice(0, 100) || (hasAttachments ? "📎 Anexo" : "");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("inbox_messages") as any).insert({
      conversation_id: conversationId,
      direction: "inbound",
      sender: "contact",
      body: messageText || null,
      content_type: contentType,
      metadata: {
        sender_phone: senderPhone,
        sender_name: senderName,
        external_id: payload.message_id || payload.message?.id,
      },
    });

    // Update conversation
    const { data: currentConvo } = await admin
      .from("conversations")
      .select("unread_count")
      .eq("id", conversationId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from("conversations") as any)
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: preview,
        unread_count:
          ((currentConvo as { unread_count: number } | null)?.unread_count ?? 0) + 1,
        ...(chatId ? { unipile_chat_id: chatId } : {}),
      })
      .eq("id", conversationId);

    return ok("message_received");
  }

  return ok("unhandled");
}
