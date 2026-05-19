import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarNav } from "./SidebarNav";

describe("SidebarNav", () => {
  it("renders all influencer menu items", () => {
    render(<SidebarNav variant="influencer" />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Métricas")).toBeInTheDocument();
    expect(screen.getByText("Calendário")).toBeInTheDocument();
    expect(screen.getByText("Vendas")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
  });

  it("renders all admin menu items", () => {
    render(<SidebarNav variant="admin" />);
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
    expect(screen.getByText("Influenciadores")).toBeInTheDocument();
    expect(screen.getByText("Agendador")).toBeInTheDocument();
    expect(screen.getByText("Mensagens")).toBeInTheDocument();
    expect(screen.getByText("Marcas")).toBeInTheDocument();
    expect(screen.getByText("Hotmart")).toBeInTheDocument();
  });
});
