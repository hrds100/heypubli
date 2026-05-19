import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdminScheduler } from "./AdminScheduler";

const MOCK_INFLUENCERS = [
  { id: "user-1", first_name: "Ana", last_name: "Silva" },
  { id: "user-2", first_name: "Carlos", last_name: "Santos" },
];

describe("AdminScheduler", () => {
  it("renders heading", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} />);
    expect(screen.getByText("Agendador")).toBeInTheDocument();
  });

  it("shows influencer checkboxes", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} />);
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Carlos Santos")).toBeInTheDocument();
  });

  it("shows schedule button", () => {
    render(<AdminScheduler influencers={MOCK_INFLUENCERS} />);
    expect(screen.getByText("Agendar post")).toBeInTheDocument();
  });
});
