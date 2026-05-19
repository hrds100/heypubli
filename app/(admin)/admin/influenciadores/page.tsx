import { AdminInfluencers } from "@/features/admin-influencers";
import { MOCK_INFLUENCER } from "@/mocks/profiles.mock";

const MOCK_ROWS = [
  {
    profile: MOCK_INFLUENCER,
    instagram: {
      id: "ig-1",
      profile_id: "user-1",
      ig_user_id: "123",
      ig_username: "anasilva",
      access_token: "token",
      token_expires_at: "2026-07-19T00:00:00Z",
      token_refreshed_at: null,
      is_connected: true,
      followers_count: 15000,
      created_at: "2026-05-01T00:00:00Z",
    },
    totalSales: 12,
    commission: 359.4,
  },
  {
    profile: {
      ...MOCK_INFLUENCER,
      id: "user-2",
      first_name: "Carlos",
      last_name: "Santos",
      email: "carlos@example.com",
    },
    instagram: null,
    totalSales: 0,
    commission: 0,
  },
];

export default function InfluenciadoresPage() {
  return <AdminInfluencers influencers={MOCK_ROWS} />;
}
