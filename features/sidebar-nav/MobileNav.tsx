"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Calendar,
  BarChart3,
  DollarSign,
  Settings,
  Users,
  Clock,
  MessageSquare,
  Tag,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const influencerItems = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Métricas", href: "/metricas", icon: BarChart3 },
  { label: "Calendário", href: "/calendario", icon: Calendar },
  { label: "Vendas", href: "/analytics", icon: DollarSign },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

const adminItems = [
  { label: "Visão Geral", href: "/admin", icon: LayoutDashboard },
  { label: "Influenciadores", href: "/admin/influenciadores", icon: Users },
  { label: "Agendador", href: "/admin/agendador", icon: Clock },
  { label: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
  { label: "Marcas", href: "/admin/marcas", icon: Tag },
  { label: "Hotmart", href: "/admin/hotmart", icon: ShoppingCart },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

interface MobileNavProps {
  variant: "influencer" | "admin";
}

export function MobileNav({ variant }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = variant === "admin" ? adminItems : influencerItems;

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link href={variant === "admin" ? "/admin" : "/dashboard"}>
          <span
            className="text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #F56040, #E1306C, #C13584)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hey Publi
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
        >
          <Menu size={22} />
        </button>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Link
                href={variant === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
              >
                <span
                  className="text-xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #F56040, #E1306C, #C13584)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Hey Publi
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-4 py-4">
              {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground active:bg-background-secondary"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border px-4 py-4">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground-secondary transition-all duration-150 active:scale-[0.97] hover:bg-red-50 hover:text-error"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </form>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
