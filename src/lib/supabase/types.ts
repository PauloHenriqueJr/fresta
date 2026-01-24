export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      b2b_campaigns: {
        Row: {
          created_at: string | null
          duration: number
          id: string
          leads: number | null
          opens: number | null
          org_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["b2b_campaign_status"]
          theme_id: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          duration?: number
          id?: string
          leads?: number | null
          opens?: number | null
          org_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["b2b_campaign_status"]
          theme_id: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          id?: string
          leads?: number | null
          opens?: number | null
          org_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["b2b_campaign_status"]
          theme_id?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_campaigns_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_members: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          org_id: string
          role: Database["public"]["Enums"]["b2b_role"]
          status: Database["public"]["Enums"]["b2b_member_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          org_id: string
          role?: Database["public"]["Enums"]["b2b_role"]
          status?: Database["public"]["Enums"]["b2b_member_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          org_id?: string
          role?: Database["public"]["Enums"]["b2b_role"]
          status?: Database["public"]["Enums"]["b2b_member_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_organizations: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          logo_emoji: string | null
          name: string
          owner_id: string
          primary_hue: number | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          logo_emoji?: string | null
          name?: string
          owner_id: string
          primary_hue?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          logo_emoji?: string | null
          name?: string
          owner_id?: string
          primary_hue?: number | null
          updated_at?: string | null
          allowed_domains?: string[] | null
          sso_enabled?: boolean
          watermark_enabled?: boolean
          block_screenshots?: boolean
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          action: string
          module: string
          details: Json | null
          level: Database["public"]["Enums"]["audit_log_level"]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          action: string
          module: string
          details?: Json | null
          level?: Database["public"]["Enums"]["audit_log_level"]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          action?: string
          module?: string
          details?: Json | null
          level?: Database["public"]["Enums"]["audit_log_level"]
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          rating: number | null
          comment: string | null
          module: string | null
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          rating?: number | null
          comment?: string | null
          module?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          rating?: number | null
          comment?: string | null
          module?: string | null
          status?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          created_at: string
          code: string
          discount_percent: number | null
          expires_at: string | null
          usage_limit: number | null
          usage_count: number | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          code: string
          discount_percent?: number | null
          expires_at?: string | null
          usage_limit?: number | null
          usage_count?: number | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          code?: string
          discount_percent?: number | null
          expires_at?: string | null
          usage_limit?: number | null
          usage_count?: number | null
          is_active?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          amount_cents: number
          currency: string | null
          status: string | null
          plan_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          amount_cents: number
          currency?: string | null
          status?: string | null
          plan_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          amount_cents?: number
          currency?: string | null
          status?: string | null
          plan_id?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      calendar_days: {
        Row: {
          calendar_id: string
          content_type: Database["public"]["Enums"]["day_content_type"] | null
          created_at: string | null
          day: number
          id: string
          label: string | null
          message: string | null
          opened_count: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          calendar_id: string
          content_type?: Database["public"]["Enums"]["day_content_type"] | null
          created_at?: string | null
          day: number
          id?: string
          label?: string | null
          message?: string | null
          opened_count?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          calendar_id?: string
          content_type?: Database["public"]["Enums"]["day_content_type"] | null
          created_at?: string | null
          day?: number
          id?: string
          label?: string | null
          message?: string | null
          opened_count?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_days_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
        ]
      }
      calendars: {
        Row: {
          created_at: string | null
          duration: number
          id: string
          likes: number | null
          owner_id: string
          password: string | null
          privacy: Database["public"]["Enums"]["calendar_privacy"]
          shares: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["calendar_status"]
          theme_id: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          duration?: number
          id?: string
          likes?: number | null
          owner_id: string
          password?: string | null
          privacy?: Database["public"]["Enums"]["calendar_privacy"]
          shares?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["calendar_status"]
          theme_id: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          id?: string
          likes?: number | null
          owner_id?: string
          password?: string | null
          privacy?: Database["public"]["Enums"]["calendar_privacy"]
          shares?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["calendar_status"]
          theme_id?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          interval: Database["public"]["Enums"]["plan_interval"]
          name: string
          price_cents: number
          status: Database["public"]["Enums"]["plan_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          interval?: Database["public"]["Enums"]["plan_interval"]
          name: string
          price_cents?: number
          status?: Database["public"]["Enums"]["plan_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          interval?: Database["public"]["Enums"]["plan_interval"]
          name?: string
          price_cents?: number
          status?: Database["public"]["Enums"]["plan_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          id: string
          plan_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          id?: string
          plan_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_overrides: {
        Row: {
          base_theme_id: string
          created_at: string | null
          custom_emoji: string | null
          custom_name: string | null
          enabled: boolean | null
          id: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          base_theme_id: string
          created_at?: string | null
          custom_emoji?: string | null
          custom_name?: string | null
          enabled?: boolean | null
          id?: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          base_theme_id?: string
          created_at?: string | null
          custom_emoji?: string | null
          custom_name?: string | null
          enabled?: boolean | null
          id?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_calendar_shares: {
        Args: {
          _calendar_id: string
        }
        Returns: undefined
      }
      increment_calendar_views: {
        Args: {
          _calendar_id: string
        }
        Returns: undefined
      }
      increment_day_opened: {
        Args: {
          _day_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      b2b_campaign_status: "draft" | "active" | "archived"
      b2b_member_status: "active" | "invited"
      b2b_role: "owner" | "admin" | "editor" | "analyst"
      calendar_privacy: "public" | "private"
      calendar_status: "ativo" | "rascunho" | "finalizado"
      day_content_type: "text" | "photo" | "gif" | "link"
      plan_interval: "month" | "year"
      plan_status: "active" | "archived"
      subscription_status: "trialing" | "active" | "canceled"
      audit_log_level: "info" | "warning" | "error" | "security"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
