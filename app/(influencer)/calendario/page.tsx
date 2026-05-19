import { DashboardCalendar } from "@/features/dashboard-calendar";
import type { ScheduledPost } from "@/types/database";

const MOCK_POSTS: ScheduledPost[] = [
  {
    id: "post-1",
    profile_id: "user-1",
    brand_id: "brand-1",
    media_type: "feed",
    media_url: "https://example.com/image1.jpg",
    caption: "Descubra o ScanPlates!",
    scheduled_at: new Date().toISOString(),
    status: "published",
    ig_media_id: null,
    published_at: new Date().toISOString(),
    error_message: null,
    created_at: "2026-05-18T00:00:00Z",
  },
  {
    id: "post-2",
    profile_id: "user-1",
    brand_id: "brand-1",
    media_type: "story_image",
    media_url: "https://example.com/story1.jpg",
    caption: "Confira!",
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    status: "pending",
    ig_media_id: null,
    published_at: null,
    error_message: null,
    created_at: "2026-05-18T00:00:00Z",
  },
];

export default function CalendarioPage() {
  return <DashboardCalendar posts={MOCK_POSTS} />;
}
