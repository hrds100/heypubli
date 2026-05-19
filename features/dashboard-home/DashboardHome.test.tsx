import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardHome } from "./DashboardHome";
import type { InstagramData } from "./DashboardHome";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import { BRANDS, FUTURE_BRANDS } from "@/mocks/brands.mock";

const mockInstagram: InstagramData = {
  username: "hugo8re",
  name: "Hugo Rodrigo",
  biography: "Playing Real Life Monopoly",
  profilePictureUrl: undefined,
  followersCount: 1615,
  followsCount: 1627,
  mediaCount: 20,
  accountType: "BUSINESS",
  isConnected: true,
};

describe("DashboardHome", () => {
  it("renders welcome message with name", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagram={mockInstagram}
      />,
    );
    expect(screen.getByText(/Olá, Ana/)).toBeInTheDocument();
  });

  it("shows Instagram username when connected", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagram={mockInstagram}
      />,
    );
    expect(screen.getByText("@hugo8re")).toBeInTheDocument();
  });

  it("shows connect button when not connected", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagram={null}
      />,
    );
    expect(screen.getByText("Conectar meu Instagram")).toBeInTheDocument();
  });
});
