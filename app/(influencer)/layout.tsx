import { SidebarNav } from "@/features/sidebar-nav";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden border-r border-border bg-background lg:flex">
        <SidebarNav variant="influencer" />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
