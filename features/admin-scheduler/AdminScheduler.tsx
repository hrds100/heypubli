"use client";

import { useState } from "react";
import { Upload, Calendar, Send } from "lucide-react";
import type { Profile } from "@/types/database";

interface AdminSchedulerProps {
  influencers: Pick<Profile, "id" | "first_name" | "last_name">[];
}

const POST_TYPES = [
  { value: "feed", label: "Feed" },
  { value: "story_image", label: "Story (Imagem)" },
  { value: "story_video", label: "Story (Vídeo)" },
  { value: "reel", label: "Reel" },
  { value: "carousel", label: "Carrossel" },
] as const;

export function AdminScheduler({ influencers }: AdminSchedulerProps) {
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [postType, setPostType] = useState("feed");

  const toggleInfluencer = (id: string) => {
    setSelectedInfluencers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Agendador</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Selecionar influenciadores</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {influencers.map((inf) => (
              <label
                key={inf.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-background-secondary"
              >
                <input
                  type="checkbox"
                  checked={selectedInfluencers.includes(inf.id)}
                  onChange={() => toggleInfluencer(inf.id)}
                  className="rounded border-border"
                />
                <span className="text-sm">
                  {inf.first_name} {inf.last_name}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-foreground-secondary">
            {selectedInfluencers.length} selecionado(s)
          </p>
        </section>

        <section className="rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Detalhes do post</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Tipo de post
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              >
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Legenda
              </label>
              <textarea
                rows={3}
                placeholder="Escreva a legenda do post..."
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Data e hora
              </label>
              <input
                type="datetime-local"
                className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
              <Upload size={24} className="mx-auto mb-2 text-foreground-secondary" />
              <p className="text-sm text-foreground-secondary">
                Arraste mídia ou clique para upload
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-background-secondary">
          <Calendar size={16} />
          Agendar recorrente (72h)
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
          <Send size={16} />
          Agendar post
        </button>
      </div>
    </div>
  );
}
