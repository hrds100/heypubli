"use client";

import { useState, useTransition } from "react";
import { Plus, Users, Tag, Pencil, Trash2, X } from "lucide-react";
import { createBrand, updateBrand, deleteBrand } from "@/lib/actions/admin";
import type { Brand } from "@/types/database";

interface BrandRow {
  brand: Brand;
  influencerCount: number;
}

interface AdminBrandsProps {
  brands: BrandRow[];
}

function BrandForm({ brand, onClose }: { brand?: Brand; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      try {
        if (brand) {
          await updateBrand(brand.id, formData);
        } else {
          await createBrand(formData);
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{brand ? "Editar marca" : "Nova marca"}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-background-secondary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nome</label>
            <input
              name="name"
              required
              defaultValue={brand?.name ?? ""}
              className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={brand?.description ?? ""}
              className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Hotmart Product ID</label>
              <input
                name="hotmart_product_id"
                defaultValue={brand?.hotmart_product_id ?? ""}
                className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Hotmart URL</label>
              <input
                name="hotmart_product_url"
                defaultValue={brand?.hotmart_product_url ?? ""}
                className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">URL do logo</label>
            <input
              name="logo_url"
              type="url"
              defaultValue={brand?.logo_url ?? ""}
              placeholder="https://exemplo.com/logo.png"
              className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Setores (separados por vírgula)</label>
            <input
              name="target_sectors"
              defaultValue={brand?.target_sectors.join(", ") ?? ""}
              placeholder="Fitness, Beleza, Saúde"
              className="rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={brand?.is_active ?? true}
              className="rounded border-border"
            />
            <span className="text-sm">Marca ativa</span>
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-background-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
            >
              {isPending ? "Salvando..." : brand ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminBrands({ brands }: AdminBrandsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | undefined>();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (brandId: string) => {
    startTransition(async () => {
      await deleteBrand(brandId);
      setConfirmDelete(null);
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <button
          onClick={() => {
            setEditBrand(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          <Plus size={16} />
          Nova marca
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((row) => (
          <div key={row.brand.id} className="rounded-xl border border-border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{row.brand.name}</h3>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {row.brand.description}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0">
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

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
              <button
                onClick={() => {
                  setEditBrand(row.brand);
                  setShowForm(true);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background-secondary transition-colors"
              >
                <Pencil size={14} />
                Editar
              </button>
              {confirmDelete === row.brand.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(row.brand.id)}
                    disabled={isPending}
                    className="rounded-lg bg-error px-3 py-1.5 text-sm font-medium text-white hover:bg-error/90 disabled:opacity-50"
                  >
                    {isPending ? "Excluindo..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(row.brand.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-error/30 px-3 py-1.5 text-sm text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="rounded-xl border border-border p-8 text-center text-foreground-secondary">
          Nenhuma marca cadastrada ainda.
        </div>
      )}

      {showForm && (
        <BrandForm
          brand={editBrand}
          onClose={() => {
            setShowForm(false);
            setEditBrand(undefined);
          }}
        />
      )}
    </div>
  );
}
