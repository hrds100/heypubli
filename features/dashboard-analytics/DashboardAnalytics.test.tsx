import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardAnalytics } from "./DashboardAnalytics";

const baseProps = {
  totalSales: 15,
  totalCommission: 270,
  monthlySales: [],
  lastPublishedAt: null,
  affiliateClicks: 42,
  profileMetrics: [],
};

describe("DashboardAnalytics", () => {
  it("renders analytics heading", () => {
    render(<DashboardAnalytics {...baseProps} />);
    expect(screen.getByText("Analytics de Vendas")).toBeInTheDocument();
  });

  it("displays total sales and commission", () => {
    render(<DashboardAnalytics {...baseProps} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("R$ 270,00")).toBeInTheDocument();
  });

  it("shows connect prompt when no metrics", () => {
    render(<DashboardAnalytics {...baseProps} />);
    expect(screen.getByText(/Conecte seu Instagram/)).toBeInTheDocument();
  });
});
