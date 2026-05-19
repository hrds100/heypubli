import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInstagramConnection } from "@/lib/data/instagram";
import { getInstagramProfile, getInstagramMedia } from "@/lib/integrations/instagram";
import { DashboardMetrics } from "@/features/dashboard-metrics";
import type { ProfileMetrics } from "@/features/dashboard-metrics";

export const dynamic = "force-dynamic";

function buildMetrics(
  profile: {
    followers_count?: number;
    follows_count?: number;
    media_count: number;
  },
  media: {
    media_type: string;
    like_count?: number;
    comments_count?: number;
  }[],
): ProfileMetrics {
  const totalLikes = media.reduce((s, m) => s + (m.like_count ?? 0), 0);
  const totalComments = media.reduce((s, m) => s + (m.comments_count ?? 0), 0);
  const followers = profile.followers_count ?? 0;
  const engagement =
    followers > 0 && media.length > 0
      ? ((totalLikes + totalComments) / media.length / followers) * 100
      : 0;

  const typeMap: Record<string, { reach: number; engagement: number; count: number }> =
    {};
  for (const m of media) {
    const t =
      m.media_type === "CAROUSEL_ALBUM"
        ? "Carrossel"
        : m.media_type === "REELS"
          ? "Reels"
          : m.media_type === "VIDEO"
            ? "Vídeo"
            : "Imagem";
    if (!typeMap[t]) typeMap[t] = { reach: 0, engagement: 0, count: 0 };
    typeMap[t].reach += (m.like_count ?? 0) + (m.comments_count ?? 0);
    typeMap[t].count += 1;
    const e =
      followers > 0
        ? (((m.like_count ?? 0) + (m.comments_count ?? 0)) / followers) * 100
        : 0;
    typeMap[t].engagement += e;
  }

  const contentBreakdown = Object.entries(typeMap).map(([type, v]) => ({
    type: `${type} (${v.count})`,
    reach: v.reach,
    engagement: v.count > 0 ? v.engagement / v.count : 0,
  }));

  return {
    period: "Últimos 25 posts",
    reach: totalLikes + totalComments,
    reachChange: 0,
    views: 0,
    viewsChange: 0,
    engagement: Math.round(engagement * 10) / 10,
    engagementChange: 0,
    likes: totalLikes,
    comments: totalComments,
    shares: 0,
    saves: 0,
    newFollowers: 0,
    followersChange: 0,
    profileVisits: 0,
    topCities: [],
    topCountries: [],
    ageGender: [],
    contentBreakdown,
  };
}

export default async function MetricasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const igConnection = await getInstagramConnection(user.id);

  if (!igConnection) {
    return <DashboardMetrics profileMetrics={[]} isConnected={false} />;
  }

  let profileMetrics: ProfileMetrics[] = [];

  try {
    const [igProfile, media] = await Promise.all([
      getInstagramProfile(igConnection.access_token),
      getInstagramMedia(igConnection.access_token, 25),
    ]);

    if (media.length > 0) {
      profileMetrics = [buildMetrics(igProfile, media)];
    }
  } catch {
    // Token expired or API error — show connected but no data
  }

  return (
    <DashboardMetrics
      profileMetrics={profileMetrics}
      isConnected={true}
      igUsername={igConnection.ig_username}
    />
  );
}
