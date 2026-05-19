function getConfig() {
  const token = process.env.UNIPILE_TOKEN;
  const dsn = process.env.UNIPILE_DSN;
  if (!token || !dsn) throw new Error("UNIPILE_TOKEN and UNIPILE_DSN must be set");
  return { token, baseUrl: `https://${dsn}/api/v1` };
}

function getHeaders(): Record<string, string> {
  const { token } = getConfig();
  return { "X-API-KEY": token, accept: "application/json" };
}

export interface UnipileAccount {
  phone?: string;
  email?: string;
  type?: string;
  status?: string;
}

export async function createHostedLink(opts: {
  successUrl: string;
  failureUrl: string;
  notifyUrl: string;
  label: string;
}): Promise<{ url: string }> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/hosted/accounts/link`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "create",
      providers: ["WHATSAPP"],
      api_url: baseUrl,
      expiresOn: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      success_redirect_url: opts.successUrl,
      failure_redirect_url: opts.failureUrl,
      notify_url: opts.notifyUrl,
      name: opts.label,
    }),
  });
  if (!res.ok) throw new Error(`Unipile createHostedLink failed: ${res.status}`);
  return (await res.json()) as { url: string };
}

export async function fetchAccount(accountId: string): Promise<UnipileAccount | null> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/accounts/${accountId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j: any = await res.json();
  return {
    phone:
      j?.connection_params?.im?.phone ??
      j?.params?.phone_number ??
      j?.phone_number ??
      null,
    email: j?.connection_params?.imap?.email ?? j?.email ?? j?.identifier ?? null,
    type: j?.type ?? j?.provider,
    status: j?.sources?.[0]?.status ?? j?.status,
  };
}

export async function sendWhatsAppMessage(
  accountId: string,
  recipientPhone: string,
  text: string,
): Promise<string | null> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/chats`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      account_id: accountId,
      attendees_ids: [recipientPhone],
      text,
    }),
  });
  if (!res.ok) throw new Error(`Unipile send failed: ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return data.message_id ?? data.chat_id ?? data.id ?? null;
}

export async function sendToExistingChat(
  chatId: string,
  text: string,
): Promise<string | null> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/chats/${chatId}/messages`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Unipile sendToChat failed: ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return data.message_id ?? data.id ?? null;
}

export function toE164(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.replace(/^whatsapp:/, "").trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (!digits) return trimmed;
  return trimmed.startsWith("+") ? trimmed : `+${digits}`;
}
