import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardHome } from "./DashboardHome";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import { BRANDS, FUTURE_BRANDS } from "@/mocks/brands.mock";

describe("DashboardHome", () => {
  it("renders welcome message with name", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagramConnected={true}
      />,
    );
    expect(screen.getByText(/Olá, Ana/)).toBeInTheDocument();
  });

  it("shows Instagram connected status", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagramConnected={true}
      />,
    );
    expect(screen.getByText(/Conectado/)).toBeInTheDocument();
  });

  it("shows active brand names", () => {
    render(
      <DashboardHome
        profile={MOCK_INFLUENCER}
        activeBrands={BRANDS}
        futureBrands={FUTURE_BRANDS}
        instagramConnected={true}
      />,
    );
    expect(screen.getByText("ScanPlates")).toBeInTheDocument();
  });
});
