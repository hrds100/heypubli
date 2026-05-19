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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const influencerMain = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Métricas", href: "/metricas", icon: BarChart3 },
  { label: "Calendário", href: "/calendario", icon: Calendar },
  { label: "Vendas", href: "/analytics", icon: DollarSign },
];

const influencerBottom = [
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

const adminMain = [
  { label: "Visão Geral", href: "/admin", icon: LayoutDashboard },
  { label: "Influenciadores", href: "/admin/influenciadores", icon: Users },
  { label: "Agendador", href: "/admin/agendador", icon: Clock },
  { label: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
  { label: "Marcas", href: "/admin/marcas", icon: Tag },
  { label: "Hotmart", href: "/admin/hotmart", icon: ShoppingCart },
];

const adminBottom = [
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

interface SidebarNavProps {
  variant: "influencer" | "admin";
}

export function SidebarNav({ variant }: SidebarNavProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const mainItems = variant === "admin" ? adminMain : influencerMain;
  const bottomItems = variant === "admin" ? adminBottom : influencerBottom;

  return (
    <nav
      className={`flex h-full flex-col overflow-y-auto ${collapsed ? "w-16" : "w-64"} transition-all duration-200`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <Link href={variant === "admin" ? "/admin" : "/dashboard"} className="px-3">
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
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-border px-3 py-3">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} />
              {!collapsed && item.label}
            </Link>
          );
        })}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Sair" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-red-50 hover:text-error ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && "Sair"}
          </button>
        </form>
      </div>
    </nav>
  );
}
