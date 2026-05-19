import { AdminInfluencerDetail } from "@/features/admin-influencers";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";
import type { InstagramConnection, HotmartSale, ScheduledPost } from "@/types/database";

const MOCK_INSTAGRAM: InstagramConnection = {
  id: "ig-1",
  profile_id: "user-1",
  ig_user_id: "12345678",
  ig_username: "anasilva",
  access_token: "***",
  token_expires_at: "2026-07-19T00:00:00Z",
  token_refreshed_at: "2026-05-15T10:00:00Z",
  is_connected: true,
  followers_count: 4280,
  created_at: "2026-05-01T00:00:00Z",
};

const MOCK_SALES: HotmartSale[] = [
  {
    id: "sale-1",
    profile_id: "user-1",
    transaction_id: "HT-001",
    product_name: "Curso Fitness Premium",
    sale_amount: 197.0,
    commission_amount: 98.5,
    status: "confirmed",
    sold_at: "2026-05-18T14:30:00Z",
  },
  {
    id: "sale-2",
    profile_id: "user-1",
    transaction_id: "HT-002",
    product_name: "Guia de Nutrição",
    sale_amount: 47.0,
    commission_amount: 23.5,
    status: "confirmed",
    sold_at: "2026-05-16T09:15:00Z",
  },
  {
    id: "sale-3",
    profile_id: "user-1",
    transaction_id: "HT-003",
    product_name: "Curso Fitness Premium",
    sale_amount: 197.0,
    commission_amount: 98.5,
    status: "refunded",
    sold_at: "2026-05-12T20:00:00Z",
  },
];

const MOCK_POSTS: ScheduledPost[] = [
  {
    id: "post-1",
    profile_id: "user-1",
    brand_id: "brand-1",
    media_type: "feed",
    media_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    caption: "Descubra o novo sabor que vai transformar sua rotina",
    scheduled_at: "2026-05-17T10:00:00Z",
    status: "published",
    ig_media_id: "ig-media-1",
    published_at: "2026-05-17T10:01:00Z",
    error_message: null,
    reach: 3420,
    likes: 287,
    comments: 43,
    shares: 61,
    created_at: "2026-05-15T00:00:00Z",
  },
  {
    id: "post-2",
    profile_id: "user-1",
    brand_id: "brand-2",
    media_type: "reel",
    media_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    caption: "Meu treino da semana com ScanPlates",
    scheduled_at: "2026-05-20T15:00:00Z",
    status: "pending",
    ig_media_id: null,
    published_at: null,
    error_message: null,
    reach: null,
    likes: null,
    comments: null,
    shares: null,
    created_at: "2026-05-18T00:00:00Z",
  },
];

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = { ...MOCK_INFLUENCER, id };

  return (
    <AdminInfluencerDetail
      profile={profile}
      instagram={MOCK_INSTAGRAM}
      sales={MOCK_SALES}
      posts={MOCK_POSTS}
      sectors={["Saúde & Bem-estar", "Alimentação", "Fitness"]}
    />
  );
}
