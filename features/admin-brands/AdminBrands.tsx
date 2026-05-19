"use client";

import { Plus, Users, Tag } from "lucide-react";
import type { Brand } from "@/types/database";

interface BrandRow {
  brand: Brand;
  influencerCount: number;
}

interface AdminBrandsProps {
  brands: BrandRow[];
}

export function AdminBrands({ brands }: AdminBrandsProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
          <Plus size={16} />
          Nova marca
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((row) => (
          <div key={row.brand.id} className="rounded-xl border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{row.brand.name}</h3>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {row.brand.description}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  row.brand.is_active
                    ? "bg-success/10 text-success"
                    : "bg-foreground-secondary/10 text-foreground-secondary"
                }`}
              >
                {row.brand.is_active ? "Ativa" : "Futura"}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-foreground-secondary">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {row.influencerCount} influenciadores
              </span>
              <span className="flex items-center gap-1">
                <Tag size={14} />
                {row.brand.target_sectors.length} setores
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {row.brand.target_sectors.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-foreground-secondary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="rounded-xl border border-border p-8 text-center text-foreground-secondary">
          Nenhuma marca cadastrada ainda.
        </div>
      )}
    </div>
  );
}
