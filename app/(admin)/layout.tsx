import { SidebarNav, MobileNav } from "@/features/sidebar-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <MobileNav variant="admin" />
      <aside className="hidden sticky top-0 h-screen border-r border-border bg-background lg:flex">
        <SidebarNav variant="admin" />
      </aside>
      <main className="flex-1 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
