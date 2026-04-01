export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          avatar_url?: string | null;
        };
        Update: {
          name?: string | null;
          avatar_url?: string | null;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          niche: string | null;
          monthly_value: number;
          payment_day: number | null;
          status: "active" | "inactive";
          instagram: string | null;
          tiktok: string | null;
          facebook: string | null;
          youtube: string | null;
          linkedin: string | null;
          notes: string | null;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };
      contents: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          title: string;
          caption: string | null;
          hashtags: string | null;
          platform: "instagram" | "tiktok" | "facebook" | "youtube" | "linkedin" | "twitter";
          format: "reels" | "stories" | "post" | "carrossel" | "live" | "shorts" | "video";
          pillar: string | null;
          status: "planned" | "in_production" | "ready" | "posted" | "delayed";
          scheduled_at: string | null;
          posted_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contents"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["contents"]["Insert"]>;
      };
      ideas: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          title: string;
          description: string | null;
          hook: string | null;
          tags: string[];
          platform: string | null;
          source: "manual" | "ai";
          converted: boolean;
          content_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ideas"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["ideas"]["Insert"]>;
      };
      finances: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          month: number;
          year: number;
          amount: number;
          status: "paid" | "pending" | "delayed";
          due_date: string | null;
          paid_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["finances"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["finances"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "delayed_post" | "no_content" | "payment_delayed" | "payment_due" | "general";
          title: string;
          message: string;
          read: boolean;
          link: string | null;
          client_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      metrics: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          likes: number;
          comments: number;
          shares: number;
          reach: number;
          impressions: number;
          saved: number;
          recorded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["metrics"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["metrics"]["Insert"]>;
      };
    };
  };
}
