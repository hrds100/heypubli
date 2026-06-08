import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardHome } from "./DashboardHome";
import type { InstagramData } from "./DashboardHome";
import type { Brand } from "@/types/database";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import { BRANDS } from "@/mocks/brands.mock";

const AFFILIATE_URL =
  "https://affiliate.hotmart.com/affiliate-recruiting/view/5148S104879886";

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
        instagram={mockInstagram}
      />,
    );
    expect(screen.getByText("@hugo8re")).toBeInTheDocument();
  });

  it("shows connect button when not connected", () => {
    render(
      <DashboardHome profile={MOCK_INFLUENCER} activeBrands={BRANDS} instagram={null} />,
    );
    expect(screen.getByText("Conectar meu Instagram")).toBeInTheDocument();
  });

  it("links the brand name to its Hotmart affiliate page", () => {
    const brandWithUrl: Brand = { ...BRANDS[0], hotmart_product_url: AFFILIATE_URL };
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={[brandWithUrl]}
        instagram={mockInstagram}
      />,
    );
    const link = screen.getByRole("link", { name: /ScanPlates/ });
    expect(link).toHaveAttribute("href", AFFILIATE_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows the paste-your-link save field with the saved value", () => {
    render(
      <DashboardHome
        profile={{ ...MOCK_INFLUENCER, hotmart_url: "https://hotmart.com/meu-link" }}
        activeBrands={BRANDS}
        instagram={mockInstagram}
      />,
    );
    expect(screen.getByDisplayValue("https://hotmart.com/meu-link")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("shows the saved link with a copy button", () => {
    render(
      <DashboardHome
        profile={{
          ...MOCK_INFLUENCER,
          hotmart_url: "https://www.scanplates.com/?ref=ABC123",
        }}
        activeBrands={BRANDS}
        instagram={mockInstagram}
      />,
    );
    expect(
      screen.getByText("https://www.scanplates.com/?ref=ABC123"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar" })).toBeInTheDocument();
  });
});
