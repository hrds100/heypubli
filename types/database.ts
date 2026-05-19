export type Gender = "male" | "female" | "non_binary" | "undisclosed";
export type SectorType = "preferred" | "content";
export type PostMediaType = "feed" | "story_image" | "story_video" | "reel" | "carousel";
export type PostStatus = "pending" | "published" | "failed";
export type MessageChannel = "whatsapp" | "email";
export type MessageDirection = "outbound" | "inbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";
export type SaleStatus = "confirmed" | "refunded" | "cancelled";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  address_street: string | null;
  address_city: string | null;
  address_postal_code: string | null;
  address_country: string;
  phone: string | null;
  timezone: string;
  hotmart_url: string | null;
  hotmart_affiliate_code: string | null;
  onboarding_step: number;
  onboarding_complete: boolean;
  is_admin: boolean;
  last_accessed_at: string | null;
  created_at: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export interface InfluencerSector {
  id: string;
  profile_id: string;
  sector_id: string;
  type: SectorType;
  created_at: string;
}

export interface InstagramConnection {
  id: string;
  profile_id: string;
  ig_user_id: string;
  ig_username: string;
  access_token: string;
  token_expires_at: string;
  token_refreshed_at: string | null;
  is_connected: boolean;
  followers_count: number | null;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  hotmart_product_id: string | null;
  hotmart_product_url: string | null;
  target_sectors: string[];
  is_active: boolean;
  created_at: string;
}

export interface BrandAssignment {
  id: string;
  profile_id: string;
  brand_id: string;
  assigned_at: string;
}

export interface ScheduledPost {
  id: string;
  profile_id: string;
  brand_id: string;
  media_type: PostMediaType;
  media_url: string;
  caption: string;
  scheduled_at: string;
  status: PostStatus;
  ig_media_id: string | null;
  published_at: string | null;
  error_message: string | null;
  reach: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  created_at: string;
}

export interface MessageLog {
  id: string;
  profile_id: string;
  channel: MessageChannel;
  direction: MessageDirection;
  content: string;
  status: MessageStatus;
  sent_at: string;
  sent_by: string;
}

export interface HotmartSale {
  id: string;
  profile_id: string;
  transaction_id: string;
  product_name: string;
  sale_amount: number;
  commission_amount: number;
  status: SaleStatus;
  sold_at: string;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  impersonated_id: string;
  started_at: string;
  ended_at: string | null;
  actions_taken: Record<string, unknown>;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      sectors: {
        Row: Sector;
        Insert: Omit<Sector, "id">;
        Update: Partial<Omit<Sector, "id">>;
        Relationships: [];
      };
      influencer_sectors: {
        Row: InfluencerSector;
        Insert: Omit<InfluencerSector, "id" | "created_at">;
        Update: Partial<Omit<InfluencerSector, "id" | "created_at">>;
        Relationships: [];
      };
      instagram_connections: {
        Row: InstagramConnection;
        Insert: Omit<InstagramConnection, "id" | "created_at">;
        Update: Partial<Omit<InstagramConnection, "id" | "created_at">>;
        Relationships: [];
      };
      brands: {
        Row: Brand;
        Insert: Omit<Brand, "id" | "created_at">;
        Update: Partial<Omit<Brand, "id" | "created_at">>;
        Relationships: [];
      };
      brand_assignments: {
        Row: BrandAssignment;
        Insert: Omit<BrandAssignment, "id" | "assigned_at">;
        Update: Partial<Omit<BrandAssignment, "id" | "assigned_at">>;
        Relationships: [];
      };
      scheduled_posts: {
        Row: ScheduledPost;
        Insert: Omit<ScheduledPost, "id" | "created_at">;
        Update: Partial<Omit<ScheduledPost, "id" | "created_at">>;
        Relationships: [];
      };
      messages_log: {
        Row: MessageLog;
        Insert: Omit<MessageLog, "id">;
        Update: Partial<Omit<MessageLog, "id">>;
        Relationships: [];
      };
      hotmart_sales: {
        Row: HotmartSale;
        Insert: Omit<HotmartSale, "id">;
        Update: Partial<Omit<HotmartSale, "id">>;
        Relationships: [];
      };
      admin_sessions: {
        Row: AdminSession;
        Insert: Omit<AdminSession, "id">;
        Update: Partial<Omit<AdminSession, "id">>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
