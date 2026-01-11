export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidate_applications: {
        Row: {
          age: number | null
          applied_at: string | null
          bio: string | null
          category: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          payment_receipt_url: string | null
          phone: string | null
          photo_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          showcase_file_url: string | null
          social_media: Json | null
          status: string | null
          talents: string[] | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          applied_at?: string | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          payment_receipt_url?: string | null
          phone?: string | null
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          showcase_file_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          applied_at?: string | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          payment_receipt_url?: string | null
          phone?: string | null
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          showcase_file_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contestants: {
        Row: {
          age: number | null
          bio: string | null
          category: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          photo_url: string | null
          social_media: Json | null
          status: string | null
          talents: string[] | null
          total_votes: number | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          photo_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          total_votes?: number | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          photo_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          total_votes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jury_members: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          photo_url: string | null
          specialty: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          photo_url?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          photo_url?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      jury_votes: {
        Row: {
          comments: string | null
          contestant_id: string
          created_at: string | null
          criteria_scores: Json | null
          id: string
          jury_member_id: string
          score: number
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          contestant_id: string
          created_at?: string | null
          criteria_scores?: Json | null
          id?: string
          jury_member_id: string
          score: number
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          contestant_id?: string
          created_at?: string | null
          criteria_scores?: Json | null
          id?: string
          jury_member_id?: string
          score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jury_votes_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jury_votes_jury_member_id_fkey"
            columns: ["jury_member_id"]
            isOneToOne: false
            referencedRelation: "jury_members"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organisateurs: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          order_display: number | null
          photo_url: string | null
          role: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          order_display?: number | null
          photo_url?: string | null
          role: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order_display?: number | null
          photo_url?: string | null
          role?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      performance_videos: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          file_format: string | null
          file_size: number | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          key: string
          label: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          key: string
          label?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          key?: string
          label?: string | null
          updated_at?: string | null
          value?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      votes: {
        Row: {
          amount_paid: number | null
          contestant_id: string
          created_at: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          vote_type: string | null
          voter_ip: string
          voter_session: string | null
        }
        Insert: {
          amount_paid?: number | null
          contestant_id: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          vote_type?: string | null
          voter_ip: string
          voter_session?: string | null
        }
        Update: {
          amount_paid?: number | null
          contestant_id?: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          vote_type?: string | null
          voter_ip?: string
          voter_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_jury_member_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_jury_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "jury"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "jury"],
    },
  },
} as const
