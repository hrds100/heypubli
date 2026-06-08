import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardAnalytics } from "./DashboardAnalytics";

const baseProps = {
  totalSales: 15,
  totalCommission: 270,
  monthlySales: [],
  lastPublishedAt: null,
  affiliateClicks: 42,
  availableBalance: 0,
  pixKeyType: null,
  pixKey: null,
};

const PROPS_WITH_BALANCE = { ...baseProps, availableBalance: 120, pixKey: "x@y.com" };

describe("DashboardAnalytics", () => {
  it("renders vendas heading", () => {
    render(<DashboardAnalytics {...baseProps} />);
    expect(screen.getByText("Vendas")).toBeInTheDocument();
  });

  it("displays total sales and commission", () => {
    render(<DashboardAnalytics {...baseProps} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("R$ 270,00")).toBeInTheDocument();
  });

  it("shows the available balance and a request-payment button", () => {
    render(<DashboardAnalytics {...PROPS_WITH_BALANCE} />);
    expect(screen.getByText("R$ 120,00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Solicitar pagamento" }),
    ).toBeInTheDocument();
  });
});
