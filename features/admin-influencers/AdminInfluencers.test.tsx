import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdminInfluencers } from "./AdminInfluencers";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";

const MOCK_ROWS = [
  {
    profile: MOCK_INFLUENCER,
    instagram: {
      id: "ig-1",
      profile_id: "user-1",
      ig_user_id: "123",
      ig_username: "anasilva",
      access_token: "token",
      token_expires_at: "2026-07-19T00:00:00Z",
      token_refreshed_at: null,
      is_connected: true,
      followers_count: 15000,
      created_at: "2026-05-01T00:00:00Z",
    },
    totalSales: 12,
    commission: 359.4,
  },
];

describe("AdminInfluencers", () => {
  it("renders heading", () => {
    render(<AdminInfluencers influencers={MOCK_ROWS} />);
    expect(screen.getByText("Influenciadores")).toBeInTheDocument();
  });

  it("shows influencer name", () => {
    render(<AdminInfluencers influencers={MOCK_ROWS} />);
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<AdminInfluencers influencers={[]} />);
    expect(screen.getByText("Nenhum influenciador encontrado.")).toBeInTheDocument();
  });
});
