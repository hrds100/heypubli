"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  BarChart3,
  Settings,
  Users,
  Clock,
  MessageSquare,
  Tag,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react";

const influencerItems = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Calendário", href: "/calendario", icon: Calendar },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
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

interface SidebarNavProps {
  variant: "influencer" | "admin";
}

export function SidebarNav({ variant }: SidebarNavProps) {
  const pathname = usePathname();
  const items = variant === "admin" ? adminItems : influencerItems;

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-3">
        <h1
          className="text-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #F56040, #E1306C, #C13584)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hey Publi
        </h1>
      </div>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
