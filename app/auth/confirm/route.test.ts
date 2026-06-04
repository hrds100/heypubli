import { describe, it, expect, vi, beforeEach } from "vitest";

const mockVerifyOtp = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: { verifyOtp: mockVerifyOtp },
  }),
}));

import { GET } from "./route";

function makeRequest(query: string): Request {
  return new Request(`http://localhost:3000/auth/confirm${query}`);
}

describe("GET /auth/confirm (magic-link token_hash flow)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies a valid token_hash and redirects to the dashboard", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });

    const res = await GET(makeRequest("?token_hash=abc123&type=magiclink"));

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      type: "magiclink",
      token_hash: "abc123",
    });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects to a safe relative `next` path on success", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });

    const res = await GET(
      makeRequest("?token_hash=abc123&type=magiclink&next=/configuracoes"),
    );

    expect(res.headers.get("location")).toBe("http://localhost:3000/configuracoes");
  });

  it("ignores an absolute/external `next` to prevent open redirects", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });

    const res = await GET(
      makeRequest("?token_hash=abc123&type=magiclink&next=https://evil.com"),
    );

    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects to login with the PT-BR error when token is missing", async () => {
    const res = await GET(makeRequest(""));

    expect(mockVerifyOtp).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("/login?erro=");
    expect(decodeURIComponent(res.headers.get("location")!)).toContain(
      "Link inválido ou expirado",
    );
  });

  it("redirects to login with the PT-BR error when verifyOtp fails", async () => {
    mockVerifyOtp.mockResolvedValue({ error: { message: "expired" } });

    const res = await GET(makeRequest("?token_hash=stale&type=magiclink"));

    expect(decodeURIComponent(res.headers.get("location")!)).toContain(
      "Link inválido ou expirado",
    );
  });
});
