import { describe, it, expect, vi, beforeEach } from "vitest";

const getUser = vi.fn();
const profileSingle = vi.fn();
let salesData: unknown[] = [];

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser } }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "profiles") {
        return { select: () => ({ eq: () => ({ single: profileSingle }) }) };
      }
      if (table === "hotmart_sales") {
        // select().eq().eq().is()  → awaited query result
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chain: any = {
          select: () => chain,
          eq: () => chain,
          is: () => Promise.resolve({ data: salesData }),
        };
        return chain;
      }
      return {};
    },
  }),
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { requestPayout } from "./payouts";

describe("requestPayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    salesData = [];
  });

  it("refuses when the influencer has no PIX key", async () => {
    profileSingle.mockResolvedValue({ data: { pix_key: null, pix_key_type: null } });
    const r = await requestPayout();
    expect(r).toEqual({ error: expect.stringMatching(/PIX/) });
  });

  it("refuses when there is no cleared balance", async () => {
    profileSingle.mockResolvedValue({
      data: { pix_key: "a@b.com", pix_key_type: "email" },
    });
    salesData = []; // nothing cleared
    const r = await requestPayout();
    expect(r).toEqual({ error: expect.stringMatching(/Nenhum valor/) });
  });
});
