"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Image, Film } from "lucide-react";
import type { ScheduledPost } from "@/types/database";

interface DashboardCalendarProps {
  posts: ScheduledPost[];
}

const STATUS_COLORS = {
  published: "bg-success",
  pending: "bg-warning",
  failed: "bg-error",
} as const;

export function DashboardCalendar({ posts }: DashboardCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const getPostsForDay = (day: Date) =>
    posts.filter((p) => isSameDay(new Date(p.scheduled_at), day));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg border border-border p-2 hover:bg-background-secondary"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[150px] text-center font-medium">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg border border-border p-2 hover:bg-background-secondary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span>Publicado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <span>Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-error" />
          <span>Falhou</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl border border-border bg-border overflow-hidden">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div
            key={d}
            className="bg-background-secondary p-2 text-center text-xs font-medium text-foreground-secondary"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background p-2 min-h-[80px]" />
        ))}
        {days.map((day) => {
          const dayPosts = getPostsForDay(day);
          return (
            <div key={day.toISOString()} className="bg-background p-2 min-h-[80px]">
              <span className="text-xs text-foreground-secondary">
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-white ${STATUS_COLORS[post.status]}`}
                  >
                    {post.media_type === "feed" ? (
                      <Image size={10} />
                    ) : (
                      <Film size={10} />
                    )}
                    <span className="truncate">
                      {post.media_type === "feed" ? "Feed" : "Story"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
