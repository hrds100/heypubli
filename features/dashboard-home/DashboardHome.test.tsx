import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardHome } from "./DashboardHome";
import type { InstagramData } from "./DashboardHome";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";

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

const baseProps = {
  profile: MOCK_INFLUENCER,
  instagram: mockInstagram,
  shareLink: "https://www.scanplates.com/?sck=ana4k2p9",
  clicks: 12,
  sales: 3,
  earnings: 36,
};

describe("DashboardHome", () => {
  it("renders welcome message with name", () => {
    render(<DashboardHome {...baseProps} />);
    expect(screen.getByText(/Olá, Ana/)).toBeInTheDocument();
  });

  it("shows Instagram username when connected", () => {
    render(<DashboardHome {...baseProps} />);
    expect(screen.getByText("@hugo8re")).toBeInTheDocument();
  });

  it("shows connect button when not connected", () => {
    render(<DashboardHome {...baseProps} instagram={null} />);
    expect(screen.getByText("Conectar meu Instagram")).toBeInTheDocument();
  });

  it("shows the influencer's share link with a copy button", () => {
    render(<DashboardHome {...baseProps} />);
    expect(
      screen.getByText("https://www.scanplates.com/?sck=ana4k2p9"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar" })).toBeInTheDocument();
  });
});
