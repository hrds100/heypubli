import { describe, it, expect, vi, beforeEach } from "vitest";

const mockInsert = vi.fn().mockReturnValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({ error: null }),
});
const mockSelectSingle = vi.fn();
const mockSelectEq = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "hotmart_sales") {
        return {
          insert: mockInsert,
          update: mockUpdate,
          select: () => ({
            eq: () => ({
              single: mockSelectSingle,
            }),
          }),
        };
      }
      if (table === "profiles") {
        return {
          select: () => ({
            eq: (field: string, value: string) => {
              if (field === "hotmart_affiliate_code") {
                return { single: mockSelectEq };
              }
              return {
                eq: () => ({ single: mockSelectEq }),
              };
            },
          }),
        };
      }
      return {};
    },
  }),
}));

import { POST } from "./route";

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/webhooks/hotmart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Hotmart webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectSingle.mockResolvedValue({ data: null });
    mockSelectEq.mockResolvedValue({ data: null });
    delete process.env.HOTMART_HOTTOK;
  });

  it("rejects invalid hottok when configured", async () => {
    process.env.HOTMART_HOTTOK = "correct-token";
    const res = await POST(
      makeRequest({ hottok: "wrong", event: "PURCHASE_APPROVED", data: {} }),
    );
    expect(res.status).toBe(401);
  });

  it("accepts valid hottok", async () => {
    process.env.HOTMART_HOTTOK = "correct-token";
    const res = await POST(
      makeRequest({ hottok: "correct-token", event: "UNKNOWN_EVENT", data: {} }),
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 when event is missing", async () => {
    const res = await POST(makeRequest({ data: {} }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when data is missing", async () => {
    const res = await POST(makeRequest({ event: "PURCHASE_APPROVED" }));
    expect(res.status).toBe(400);
  });

  it("inserts sale on PURCHASE_APPROVED with affiliate match", async () => {
    mockSelectEq.mockResolvedValue({ data: { id: "profile-123" } });

    const res = await POST(
      makeRequest({
        event: "PURCHASE_APPROVED",
        data: {
          purchase: {
            transaction: "TX-001",
            approved_date: 1700000000000,
            price: { value: 59.99, currency_value: "BRL" },
          },
          product: { id: 999, name: "ScanPlates Pro" },
          buyer: { name: "João", email: "joao@test.com" },
          affiliates: [{ affiliate_code: "AFF-001", name: "Maria" }],
          commissions: [{ value: 17.99, source: "AFFILIATE", currency_value: "BRL" }],
        },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "profile-123",
        transaction_id: "TX-001",
        product_name: "ScanPlates Pro",
        sale_amount: 59.99,
        commission_amount: 17.99,
        status: "confirmed",
      }),
    );
  });

  it("skips duplicate transactions", async () => {
    mockSelectSingle.mockResolvedValue({ data: { id: "existing-sale" } });

    const res = await POST(
      makeRequest({
        event: "PURCHASE_APPROVED",
        data: {
          purchase: { transaction: "TX-DUPE", price: { value: 10 } },
          product: { name: "Test" },
          buyer: { email: "test@test.com" },
        },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("updates status on PURCHASE_REFUNDED", async () => {
    const res = await POST(
      makeRequest({
        event: "PURCHASE_REFUNDED",
        data: {
          purchase: { transaction: "TX-002" },
        },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ status: "refunded" });
  });

  it("updates status on PURCHASE_CHARGEBACK", async () => {
    const res = await POST(
      makeRequest({
        event: "PURCHASE_CHARGEBACK",
        data: {
          purchase: { transaction: "TX-003" },
        },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ status: "cancelled" });
  });

  it("handles unknown events gracefully", async () => {
    const res = await POST(
      makeRequest({
        event: "SUBSCRIPTION_CANCELED",
        data: { some: "payload" },
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });
});
