import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AdminCampaign } from "./AdminCampaign";
import { mockCampaign, mockItems, mockMembers, mockCandidates, mockBrands } from "./mock";

vi.mock("@/lib/actions/campaigns", () => ({
  createCampaignItem: vi.fn(),
  updateCampaignItem: vi.fn(),
  deleteCampaignItem: vi.fn(),
  addMembersToCampaign: vi.fn(),
  removeMemberFromCampaign: vi.fn(),
  updateCampaign: vi.fn(),
}));

function renderAll(overrides?: Partial<Parameters<typeof AdminCampaign>[0]>) {
  return render(
    <AdminCampaign
      campaign={mockCampaign}
      items={mockItems}
      members={mockMembers}
      candidates={mockCandidates}
      brands={mockBrands}
      {...overrides}
    />,
  );
}

describe("AdminCampaign", () => {
  it("shows the campaign name and the timeline with São Paulo timestamps", () => {
    renderAll();
    expect(screen.getByText("Campanha Principal")).toBeInTheDocument();
    // 2099-06-11T20:00:00Z → 17:00 in São Paulo
    expect(screen.getByText(/11\/06\/2099, 17:00/)).toBeInTheDocument();
    expect(screen.getByText("Story de quinta-feira")).toBeInTheDocument();
    expect(screen.getByText("Reel de lançamento")).toBeInTheDocument();
  });

  it("filters the timeline by post type", async () => {
    const user = userEvent.setup();
    renderAll();
    await user.selectOptions(screen.getByLabelText(/tipo/i), "reel");
    expect(screen.queryByText("Story de quinta-feira")).not.toBeInTheDocument();
    expect(screen.getByText("Reel de lançamento")).toBeInTheDocument();
  });

  it("lists members with when they were added", () => {
    renderAll();
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("@ana.silva")).toBeInTheDocument();
    // 2026-06-05T13:00:00Z → 10:00 in São Paulo
    expect(screen.getByText(/05\/06\/2026, 10:00/)).toBeInTheDocument();
  });

  it("opens the add-accounts modal listing connected accounts not yet in the campaign", async () => {
    const user = userEvent.setup();
    renderAll();
    await user.click(screen.getByRole("button", { name: /adicionar contas/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Bruno Costa")).toBeInTheDocument();
    expect(within(dialog).getByText(/começar agora/i)).toBeInTheDocument();
  });

  it("opens the add-item modal with type, media, caption and datetime fields", async () => {
    const user = userEvent.setup();
    renderAll();
    await user.click(screen.getByRole("button", { name: /adicionar publicação/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText(/tipo de post/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/url da mídia/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/legenda/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/data e hora/i)).toBeInTheDocument();
  });

  it("shows empty states for timeline and members", () => {
    renderAll({ items: [], members: [], candidates: [] });
    expect(screen.getByText(/nenhuma publicação na campanha/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhuma conta na campanha/i)).toBeInTheDocument();
  });
});
