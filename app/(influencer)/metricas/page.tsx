import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInstagramConnection } from "@/lib/data/instagram";
import { DashboardMetrics } from "@/features/dashboard-metrics";

export const dynamic = "force-dynamic";

export default async function MetricasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const igConnection = await getInstagramConnection(user.id);

  return (
    <DashboardMetrics
      profileMetrics={[]}
      isConnected={!!igConnection}
      igUsername={igConnection?.ig_username ?? undefined}
    />
  );
}
