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

export async function connectWhatsApp(): Promise<{
  account_id: string;
  qrCodeString: string;
  code?: string;
}> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/accounts`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "WHATSAPP" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Unipile connectWhatsApp failed: ${res.status} — ${text.slice(0, 300)}`,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const accountId =
    data.account_id ?? data.object?.account_id ?? data.checkpoint?.account_id ?? "";
  const qrCodeString =
    data.qrCodeString ?? data.checkpoint?.qrCodeString ?? data.object?.qrCodeString ?? "";
  const code = data.code ?? data.checkpoint?.code ?? data.object?.code ?? undefined;
  return { account_id: accountId, qrCodeString, code };
}

export async function getAccountStatus(
  accountId: string,
): Promise<{ status: string; phone?: string }> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/accounts/${accountId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Unipile getAccountStatus failed: ${res.status}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const status =
    data.sources?.[0]?.status ?? data.status ?? data.object?.status ?? "UNKNOWN";
  const phone =
    data.connection_params?.im?.phone_number ??
    data.connection_params?.im?.phone ??
    data.params?.phone_number ??
    data.phone_number ??
    undefined;
  return { status, phone };
}

export interface UnipileMessage {
  id: string;
  text?: string;
  timestamp?: string;
  is_sender?: number | boolean;
  chat_id?: string;
  chat_provider_id?: string;
  sender_id?: string;
  attachments?: Array<{ id: string; type?: string }>;
}

export async function getMessages(
  accountId: string,
  limit = 100,
): Promise<UnipileMessage[]> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/messages?account_id=${accountId}&limit=${limit}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return (data.items ?? []) as UnipileMessage[];
}

export async function listAccounts(): Promise<
  Array<{ id: string; type: string; status: string }>
> {
  const { baseUrl } = getConfig();
  const res = await fetch(`${baseUrl}/accounts`, { headers: getHeaders() });
  if (!res.ok) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data.items ?? []) as any[]).map((a) => ({
    id: a.id,
    type: a.type ?? a.provider,
    status: a.sources?.[0]?.status ?? a.status ?? "UNKNOWN",
  }));
}

export function toE164(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.replace(/^whatsapp:/, "").trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (!digits) return trimmed;
  return trimmed.startsWith("+") ? trimmed : `+${digits}`;
}
