import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardAnalytics } from "./DashboardAnalytics";

const baseProps = {
  totalSales: 15,
  totalCommission: 270,
  monthlySales: [],
  lastPublishedAt: null,
  affiliateClicks: 42,
  pixKeyType: null,
  pixKey: null,
};

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
});
