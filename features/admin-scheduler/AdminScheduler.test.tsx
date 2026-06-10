import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AdminScheduler } from "./AdminScheduler";

vi.mock("@/lib/actions/admin", () => ({
  schedulePost: vi.fn(),
}));

const MOCK_INFLUENCERS = [
  { id: "user-1", first_name: "Ana", last_name: "Silva" },
  { id: "user-2", first_name: "Carlos", last_name: "Santos" },
];

const MOCK_BRANDS = [{ id: "brand-1", name: "ScanPlates" }];

describe("AdminScheduler", () => {
  it("renders heading", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} brands={MOCK_BRANDS} />);
    expect(screen.getByText("Agendador")).toBeInTheDocument();
  });

  it("shows influencer checkboxes", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} brands={MOCK_BRANDS} />);
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Carlos Santos")).toBeInTheDocument();
  });

  it("shows schedule button", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} brands={MOCK_BRANDS} />);
    expect(screen.getByText("Agendar post")).toBeInTheDocument();
  });

  it("does not render the unimplemented recurring-schedule button", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} brands={MOCK_BRANDS} />);
    expect(screen.queryByText(/Agendar recorrente/)).not.toBeInTheDocument();
  });

  it("requires a media URL before scheduling", async () => {
    const user = userEvent.setup();
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} brands={MOCK_BRANDS} />);

    await user.click(screen.getByText("Ana Silva"));
    await user.type(screen.getByPlaceholderText(/legenda/i), "Olá!");
    // datetime-local inputs have no accessible name here; target by display value role
    const dateInput = document.querySelector('input[type="datetime-local"]');
    expect(dateInput).not.toBeNull();
    await user.type(dateInput as HTMLInputElement, "2099-06-12T17:00");

    await user.click(screen.getByText("Agendar post"));
    expect(await screen.findByText(/URL da mídia/i, { selector: "div" })).toBeVisible();
  });
});
