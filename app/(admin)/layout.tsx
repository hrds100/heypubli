import { SidebarNav } from "@/features/sidebar-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-background lg:block">
        <SidebarNav variant="admin" />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
