import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdminMessages } from "./AdminMessages";

describe("AdminMessages", () => {
  it("renders heading", () => {
    render(<AdminMessages messages={[]} />);
    expect(screen.getByText("Mensagens")).toBeInTheDocument();
  });

  it("shows WhatsApp and Email tabs", () => {
    render(<AdminMessages messages={[]} />);
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<AdminMessages messages={[]} />);
    expect(screen.getByText("Nenhuma mensagem de WhatsApp ainda.")).toBeInTheDocument();
  });
});
