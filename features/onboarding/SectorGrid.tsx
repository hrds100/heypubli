"use client";

import type { Sector } from "@/types/database";

interface SectorGridProps {
  sectors: Sector[];
  selected: string[];
  onToggle: (sectorId: string) => void;
  min?: number;
  max?: number;
}

export function SectorGrid({
  sectors,
  selected,
  onToggle,
  min = 3,
  max = 8,
}: SectorGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sectors
          .filter((s) => s.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((sector) => {
            const isSelected = selected.includes(sector.id);
            const atMax = selected.length >= max && !isSelected;

            return (
              <button
                key={sector.id}
                type="button"
                data-selected={isSelected ? "true" : "false"}
                disabled={atMax}
                onClick={() => onToggle(sector.id)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-foreground hover:border-accent/50"
                } ${atMax ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
              >
                {sector.name}
              </button>
            );
          })}
      </div>
      <p className="mt-3 text-xs text-foreground-secondary">
        Selecione de {min} a {max} setores ({selected.length} selecionados)
      </p>
    </div>
  );
}
