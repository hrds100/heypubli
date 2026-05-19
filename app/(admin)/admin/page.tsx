import { AdminOverview } from "@/features/admin-overview";
import {
  getAllProfiles,
  getAllInstagramConnections,
  getPostsToday,
  getPostsThisWeek,
  getSalesStats,
  getExpiringConnections,
} from "@/lib/data";

export default async function AdminPage() {
  const [profiles, connections, postsToday, postsThisWeek, salesStats, expiring] =
    await Promise.all([
      getAllProfiles(),
      getAllInstagramConnections(),
      getPostsToday(),
      getPostsThisWeek(),
      getSalesStats(),
      getExpiringConnections(7),
    ]);

  const connectedIds = new Set(connections.map((c) => c.profile_id));
  const connectedCount = profiles.filter((p) => connectedIds.has(p.id)).length;
  const pendingCount = profiles.length - connectedCount;

  const alerts: { id: string; type: "warning" | "error"; message: string }[] = [];

  if (pendingCount > 0) {
    alerts.push({
      id: "pending-ig",
      type: "warning",
      message: `${pendingCount} influenciador(es) sem Instagram conectado`,
    });
  }

  for (const conn of expiring) {
    alerts.push({
      id: `expiring-${conn.id}`,
      type: "error",
      message: `Token expirando: @${conn.ig_username}`,
    });
  }

  return (
    <AdminOverview
      stats={{
        totalInfluencers: profiles.length,
        connectedInfluencers: connectedCount,
        pendingInfluencers: pendingCount,
        postsToday,
        postsThisWeek,
        totalSales: salesStats.totalSales,
      }}
      alerts={alerts}
    />
  );
}
