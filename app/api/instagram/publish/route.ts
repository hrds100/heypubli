import { NextResponse } from "next/server";
import { markPostPublished, markPostFailed } from "@/lib/data/posts";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createMediaContainer,
  checkContainerStatus,
  publishMedia,
} from "@/lib/integrations/instagram";
import type { PostMediaType, ScheduledPost, InstagramConnection } from "@/types/database";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: posts } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .returns<ScheduledPost[]>();

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0, results: [] });
  }

  const results: { id: string; status: string }[] = [];

  for (const post of posts) {
    const { data: connection } = await supabase
      .from("instagram_connections")
      .select("*")
      .eq("profile_id", post.profile_id)
      .eq("is_connected", true)
      .returns<InstagramConnection[]>()
      .single();

    if (!connection) {
      await markPostFailed(post.id, "Instagram não conectado");
      results.push({ id: post.id, status: "failed: no connection" });
      continue;
    }

    try {
      const containerParams = buildContainerParams(
        post.media_type,
        post.media_url,
        post.caption,
        connection.ig_user_id,
        connection.access_token,
      );

      const { id: containerId } = await createMediaContainer(containerParams);
      await waitForContainer(containerId, connection.access_token);
      const { id: igMediaId } = await publishMedia(
        connection.ig_user_id,
        containerId,
        connection.access_token,
      );

      await markPostPublished(post.id, igMediaId);
      results.push({ id: post.id, status: "published" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      await markPostFailed(post.id, message);
      results.push({ id: post.id, status: `failed: ${message}` });
    }
  }

  return NextResponse.json({
    published: results.filter((r) => r.status === "published").length,
    results,
  });
}

function buildContainerParams(
  mediaType: PostMediaType,
  mediaUrl: string,
  caption: string,
  igUserId: string,
  token: string,
) {
  const base = { igUserId, token, caption };

  switch (mediaType) {
    case "feed":
      return { ...base, imageUrl: mediaUrl };
    case "story_image":
      return { ...base, imageUrl: mediaUrl, mediaType: "STORIES" as const };
    case "story_video":
      return { ...base, videoUrl: mediaUrl, mediaType: "STORIES" as const };
    case "reel":
      return { ...base, videoUrl: mediaUrl, mediaType: "REELS" as const };
    case "carousel":
      return { ...base, imageUrl: mediaUrl };
  }
}

async function waitForContainer(containerId: string, token: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const { status_code } = await checkContainerStatus(containerId, token);
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") {
      throw new Error(`Container ${status_code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Container processing timeout");
}
