import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmailLoginForm } from "./EmailLoginForm";

describe("EmailLoginForm", () => {
  it("renders an email field and a send-link button", () => {
    render(<EmailLoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /receber link de acesso/i }),
    ).toBeInTheDocument();
  });
});
