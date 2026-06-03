import { describe, it, expect, vi, beforeEach } from "vitest";

// Controllable fakes shared between the mock factory and the tests.
const mocks = vi.hoisted(() => ({
  maybeSingleResult: {
    data: null as null | { profile_id: string },
    error: null as null | { message: string },
  },
  createUserResult: {
    data: { user: { id: "new-user-id" } as { id: string } | null },
    error: null as null | { message: string },
  },
  getUserByIdResult: {
    data: { user: { email: "real@person.com" } as { email: string } | null },
    error: null as null | { message: string },
  },
  upsertSpy: vi.fn(),
  updateSpy: vi.fn(),
  createUserSpy: vi.fn(),
  getUserByIdSpy: vi.fn(),
  deleteUserSpy: vi.fn(),
  fromSpy: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => {
  function makeBuilder() {
    const b: Record<string, unknown> = {};
    b.select = vi.fn(() => b);
    b.eq = vi.fn(() => b);
    b.maybeSingle = vi.fn(() => Promise.resolve(mocks.maybeSingleResult));
    b.upsert = mocks.upsertSpy;
    b.update = (arg: unknown) => {
      mocks.updateSpy(arg);
      return b;
    };
    // makes the profile update (`...update().eq().then(...)`) awaitable
    b.then = (onF: (v: unknown) => unknown, onR?: (e: unknown) => unknown) =>
      Promise.resolve({ data: null, error: null }).then(onF, onR);
    return b;
  }
  mocks.fromSpy.mockImplementation(() => makeBuilder());
  mocks.createUserSpy.mockImplementation(() => Promise.resolve(mocks.createUserResult));
  mocks.getUserByIdSpy.mockImplementation(() => Promise.resolve(mocks.getUserByIdResult));
  mocks.deleteUserSpy.mockImplementation(() =>
    Promise.resolve({ data: null, error: null }),
  );
  mocks.upsertSpy.mockResolvedValue({ data: null, error: null });

  return {
    createAdminClient: () => ({
      from: mocks.fromSpy,
      auth: {
        admin: {
          createUser: mocks.createUserSpy,
          getUserById: mocks.getUserByIdSpy,
          deleteUser: mocks.deleteUserSpy,
        },
      },
    }),
  };
});

import { findOrCreateInfluencerByOutstand, syntheticIgEmail } from "./auth-ig";

beforeEach(() => {
  mocks.maybeSingleResult = { data: null, error: null };
  mocks.createUserResult = { data: { user: { id: "new-user-id" } }, error: null };
  mocks.getUserByIdResult = { data: { user: { email: "real@person.com" } }, error: null };
  mocks.upsertSpy.mockReset();
  mocks.upsertSpy.mockResolvedValue({ data: null, error: null });
  mocks.updateSpy.mockClear();
  mocks.createUserSpy.mockClear();
  mocks.getUserByIdSpy.mockClear();
  mocks.deleteUserSpy.mockClear();
  mocks.fromSpy.mockClear();
});

describe("syntheticIgEmail", () => {
  it("builds a deterministic, lossless-for-base62 email from the social account id", () => {
    expect(syntheticIgEmail("DLQJo")).toBe("ig_dlqjo@instagram.heypubli.com");
    // invalid chars become "-" (kept distinct), valid ._- preserved
    expect(syntheticIgEmail("acc_9!X")).toBe("ig_acc_9-x@instagram.heypubli.com");
  });
});

describe("findOrCreateInfluencerByOutstand", () => {
  it("returns the existing influencer with their CURRENT auth email, no user created", async () => {
    mocks.maybeSingleResult = { data: { profile_id: "existing-id" }, error: null };
    mocks.getUserByIdResult = {
      data: { user: { email: "changed@later.com" } },
      error: null,
    };

    const result = await findOrCreateInfluencerByOutstand({
      socialAccountId: "acc_1",
      username: "joe",
    });

    expect(result).toEqual({
      userId: "existing-id",
      email: "changed@later.com", // from getUserById, NOT recomputed synthetic
      isNew: false,
    });
    expect(mocks.getUserByIdSpy).toHaveBeenCalledWith("existing-id");
    expect(mocks.createUserSpy).not.toHaveBeenCalled();
    // the existing connection is refreshed with the latest Outstand account id
    expect(mocks.upsertSpy).toHaveBeenCalledWith(
      expect.objectContaining({ profile_id: "existing-id", ig_username: "joe" }),
      { onConflict: "profile_id" },
    );
  });

  it("creates a new auth user and maps the Outstand account when none exists", async () => {
    mocks.createUserResult = { data: { user: { id: "new-1" } }, error: null };

    const result = await findOrCreateInfluencerByOutstand({
      socialAccountId: "DLQJo",
      username: "maria",
    });

    expect(mocks.createUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ig_dlqjo@instagram.heypubli.com",
        email_confirm: true,
        user_metadata: expect.objectContaining({
          auth_provider: "instagram",
          ig_username: "maria",
        }),
      }),
    );
    expect(mocks.upsertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "new-1",
        outstand_social_account_id: "DLQJo",
        ig_username: "maria",
        is_connected: true,
      }),
      { onConflict: "profile_id" },
    );
    expect(result).toEqual({
      userId: "new-1",
      email: "ig_dlqjo@instagram.heypubli.com",
      isNew: true,
    });
    expect(mocks.deleteUserSpy).not.toHaveBeenCalled();
  });

  it("passes the pre-collected name to createUser and saves email + WhatsApp", async () => {
    mocks.createUserResult = { data: { user: { id: "new-3" } }, error: null };

    const result = await findOrCreateInfluencerByOutstand(
      { socialAccountId: "acc_x", username: "maria" },
      {
        firstName: "Maria",
        lastName: "Silva",
        email: "maria@gmail.com",
        whatsapp: "+5511999998888",
      },
    );

    expect(mocks.createUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        user_metadata: expect.objectContaining({
          first_name: "Maria",
          last_name: "Silva",
          auth_provider: "instagram",
        }),
      }),
    );
    // profile updated with real contact info + needs_contact cleared
    expect(mocks.updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "maria@gmail.com",
        whatsapp: "+5511999998888",
        needs_contact: false,
      }),
    );
    expect(result.isNew).toBe(true);
  });

  it("throws when auth user creation fails (no orphan, no mapping)", async () => {
    mocks.createUserResult = { data: { user: null }, error: { message: "boom" } };

    await expect(
      findOrCreateInfluencerByOutstand({ socialAccountId: "acc_2", username: "x" }),
    ).rejects.toThrow("boom");
    expect(mocks.upsertSpy).not.toHaveBeenCalled();
    expect(mocks.deleteUserSpy).not.toHaveBeenCalled();
  });

  it("rolls back the new auth user if mapping the Outstand account fails", async () => {
    mocks.createUserResult = { data: { user: { id: "new-2" } }, error: null };
    mocks.upsertSpy.mockRejectedValueOnce(new Error("db down"));

    await expect(
      findOrCreateInfluencerByOutstand({ socialAccountId: "acc_3", username: "y" }),
    ).rejects.toThrow("db down");
    expect(mocks.deleteUserSpy).toHaveBeenCalledWith("new-2");
  });
});
