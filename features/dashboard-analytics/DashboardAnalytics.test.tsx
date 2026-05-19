import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardAnalytics } from "./DashboardAnalytics";

describe("DashboardAnalytics", () => {
  it("renders analytics heading", () => {
    render(
      <DashboardAnalytics
        totalSales={15}
        totalCommission={270}
        monthlySales={[]}
        lastPublishedAt={null}
        affiliateClicks={42}
      />,
    );
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("displays total sales and commission", () => {
    render(
      <DashboardAnalytics
        totalSales={15}
        totalCommission={270}
        monthlySales={[]}
        lastPublishedAt={null}
        affiliateClicks={42}
      />,
    );
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("R$ 270,00")).toBeInTheDocument();
  });
});
