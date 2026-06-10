import { describe, it, expect, vi, beforeEach } from "vitest";

const pendingPosts: Record<string, unknown>[] = [];

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b: any = {
        select: () => b,
        eq: () => b,
        lte: () => b,
        order: () => b,
        returns: () => b,
        then: (resolve: (v: unknown) => void) => resolve({ data: pendingPosts }),
      };
      return b;
    },
  }),
}));

const markPostPublished = vi.fn();
const markPostFailed = vi.fn();
vi.mock("@/lib/data/posts", () => ({
  markPostPublished: (...a: unknown[]) => markPostPublished(...a),
  markPostFailed: (...a: unknown[]) => markPostFailed(...a),
}));

const createPost = vi.fn();
const getPostStatus = vi.fn();
vi.mock("@/lib/integrations/outstand", () => ({
  getUploadUrl: vi.fn(),
  confirmUpload: vi.fn(),
  createPost: (...a: unknown[]) => createPost(...a),
  getPostStatus: (...a: unknown[]) => getPostStatus(...a),
}));

vi.mock("@/lib/integrations/instagram", () => ({
  createMediaContainer: vi.fn(),
  checkContainerStatus: vi.fn(),
  publishMedia: vi.fn(),
}));

vi.mock("@/lib/data/outstand", () => ({
  getOutstandConnection: vi.fn().mockResolvedValue({
    outstand_social_account_id: "acc-1",
  }),
  getPostingSettingsAdmin: vi.fn().mockResolvedValue({
    active_provider: "outstand",
    outstand_api_key: "key-1",
  }),
  saveOutstandPostId: vi.fn(),
}));

import { GET } from "./route";

function cronRequest() {
  return new Request("http://localhost/api/instagram/publish", {
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "test-secret");
  pendingPosts.length = 0;
  markPostPublished.mockClear();
  markPostFailed.mockClear();
  createPost.mockClear();
  getPostStatus.mockClear();
});

describe("publish cron — Outstand resume safety", () => {
  it("does NOT recreate an Outstand post that already exists; resolves its status instead", async () => {
    pendingPosts.push({
      id: "post-1",
      profile_id: "user-1",
      media_type: "story_image",
      media_url: "https://cdn.example.com/s.jpg",
      caption: "Oi",
      status: "pending",
      provider: "outstand",
      outstand_post_id: "out-99", // a previous run already created it
    });
    getPostStatus.mockResolvedValue({
      socialAccounts: [{ status: "published", platformPostId: "ig-123" }],
    });

    const res = await GET(cronRequest());
    const body = await res.json();

    expect(createPost).not.toHaveBeenCalled();
    expect(markPostPublished).toHaveBeenCalledWith("post-1", "ig-123");
    expect(body.published).toBe(1);
  });

  it("marks the post failed when the existing Outstand post failed", async () => {
    pendingPosts.push({
      id: "post-2",
      profile_id: "user-1",
      media_type: "reel",
      media_url: "https://cdn.example.com/r.mp4",
      caption: "Oi",
      status: "pending",
      provider: "outstand",
      outstand_post_id: "out-77",
    });
    getPostStatus.mockResolvedValue({
      socialAccounts: [{ status: "failed", error: "rejected by Instagram" }],
    });

    await GET(cronRequest());

    expect(createPost).not.toHaveBeenCalled();
    expect(markPostFailed).toHaveBeenCalledWith("post-2", "rejected by Instagram");
  });

  it("rejects requests without the cron secret", async () => {
    const res = await GET(new Request("http://localhost/api/instagram/publish"));
    expect(res.status).toBe(401);
  });
});
