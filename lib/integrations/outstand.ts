const BASE = "https://api.outstand.so/v1";

function headers(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Outstand API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// --- Social Networks ---

export async function registerSocialNetwork(
  apiKey: string,
  clientKey: string,
  clientSecret: string,
): Promise<{ id: string; network: string }> {
  const res = await fetch(`${BASE}/social-networks`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      network: "instagram",
      client_key: clientKey,
      client_secret: clientSecret,
    }),
  });
  const json = await handleResponse<{
    data: { id: string; network: string };
  }>(res);
  return json.data;
}

export async function getAuthUrl(
  apiKey: string,
  _socialNetworkId: string,
  redirectUri: string,
  tenantId?: string,
): Promise<string> {
  const body: Record<string, string> = { redirect_uri: redirectUri };
  if (tenantId) body.tenant_id = tenantId;

  const res = await fetch(`${BASE}/social-networks/instagram/auth-url`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify(body),
  });
  const json = await handleResponse<{ data: { auth_url: string } }>(res);
  return json.data.auth_url;
}

// --- Social Accounts ---

export interface OutstandSocialAccount {
  id: string;
  network: string;
  username: string;
  nickname: string;
  isActive: boolean;
  profile_picture_url?: string;
}

export async function listSocialAccounts(
  apiKey: string,
): Promise<OutstandSocialAccount[]> {
  const res = await fetch(`${BASE}/social-accounts?network=instagram`, {
    method: "GET",
    headers: headers(apiKey),
  });
  const json = await handleResponse<{ data: OutstandSocialAccount[] }>(res);
  return json.data;
}

// Outstand's managed OAuth auto-connects the Instagram account against the tenant_id
// we passed when building the auth URL, then redirects back WITHOUT a session token.
// So after the OAuth we look the account up by that tenant_id. Retries briefly to
// absorb any propagation delay right after the redirect.
export async function getSocialAccountByTenant(
  apiKey: string,
  tenantId: string,
  attempts = 4,
): Promise<{ id: string; username: string } | null> {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(
      `${BASE}/social-accounts?network=instagram&tenant_id=${encodeURIComponent(tenantId)}`,
      { method: "GET", headers: headers(apiKey) },
    );
    const json = await handleResponse<{
      data: Array<{ id: string; username: string; createdAt?: string }>;
    }>(res);
    const accounts = json.data ?? [];
    if (accounts.length > 0) {
      // most recently connected account for this tenant
      const latest = [...accounts].sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      )[0];
      return { id: latest.id, username: latest.username };
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

// --- Pending Connections ---

export async function getPendingConnection(sessionToken: string): Promise<{
  network: string;
  availablePages: Array<{ id: string; name: string; username: string }>;
}> {
  const res = await fetch(`${BASE}/social-accounts/pending/${sessionToken}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await handleResponse<{
    data: {
      network: string;
      availablePages: Array<{ id: string; name: string; username: string }>;
    };
  }>(res);
  return json.data;
}

export async function finalizeConnection(
  sessionToken: string,
  selectedPageIds: string[],
): Promise<Array<{ id: string; nickname: string; username: string; network: string }>> {
  const res = await fetch(`${BASE}/social-accounts/pending/${sessionToken}/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedPageIds }),
  });
  const json = await handleResponse<{
    connectedAccounts: Array<{
      id: string;
      nickname: string;
      username: string;
      network: string;
    }>;
  }>(res);
  return json.connectedAccounts;
}

// --- Media Upload ---

export async function getUploadUrl(
  apiKey: string,
  filename: string,
  contentType: string,
): Promise<{ id: string; upload_url: string; expires_in: number }> {
  const res = await fetch(`${BASE}/media/upload`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({ filename, content_type: contentType }),
  });
  const json = await handleResponse<{
    data: { id: string; upload_url: string; expires_in: number };
  }>(res);
  return json.data;
}

export async function confirmUpload(
  apiKey: string,
  mediaId: string,
  size?: number,
): Promise<{ id: string; url: string; filename: string; status: string }> {
  const res = await fetch(`${BASE}/media/${mediaId}/confirm`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify(size ? { size } : {}),
  });
  const json = await handleResponse<{
    data: { id: string; url: string; filename: string; status: string };
  }>(res);
  return json.data;
}

// --- Posts ---

export interface CreatePostParams {
  content: string;
  mediaIds: string[];
  socialAccountIds: string[];
  scheduledAt?: string;
  instagram?: { publishAsStory?: boolean };
}

export async function createPost(
  apiKey: string,
  params: CreatePostParams,
): Promise<{
  id: string;
  socialAccounts: Array<{ id: string; status: string }>;
}> {
  const body: Record<string, unknown> = {
    containers: [
      {
        content: params.content,
        mediaIds: params.mediaIds,
      },
    ],
    accounts: params.socialAccountIds,
  };

  if (params.scheduledAt) body.scheduledAt = params.scheduledAt;
  if (params.instagram) body.instagram = params.instagram;

  const res = await fetch(`${BASE}/posts/`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify(body),
  });
  const json = await handleResponse<{
    post: {
      id: string;
      socialAccounts: Array<{ id: string; status: string }>;
    };
  }>(res);
  return json.post;
}

export async function getPostStatus(
  apiKey: string,
  postId: string,
): Promise<{
  id: string;
  publishedAt: string | null;
  socialAccounts: Array<{
    id: string;
    status: string;
    platformPostId?: string;
    error?: string;
  }>;
}> {
  const res = await fetch(`${BASE}/posts/${postId}`, {
    method: "GET",
    headers: headers(apiKey),
  });
  const json = await handleResponse<{
    post: {
      id: string;
      publishedAt: string | null;
      socialAccounts: Array<{
        id: string;
        status: string;
        platformPostId?: string;
        error?: string;
      }>;
    };
  }>(res);
  return json.post;
}
