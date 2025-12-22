export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      candidate_applications: {
        Row: {
          age: number | null
          applied_at: string
          bio: string | null
          category: string | null
          created_at: string
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
          updated_at: string
        }
        Insert: {
          age?: number | null
          applied_at?: string
          bio?: string | null
          category?: string | null
          created_at?: string
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
          updated_at?: string
        }
        Update: {
          age?: number | null
          applied_at?: string
          bio?: string | null
          category?: string | null
          created_at?: string
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
          updated_at?: string
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
          created_at: string
          id: string
          location: string | null
          name: string
          photo_url: string | null
          social_media: Json | null
          status: string | null
          talents: string[] | null
          total_votes: number | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          bio?: string | null
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          photo_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          total_votes?: number | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          bio?: string | null
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          photo_url?: string | null
          social_media?: Json | null
          status?: string | null
          talents?: string[] | null
          total_votes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      organisateurs: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string
          id: string
          name: string
          order_display: number | null
          photo_url: string | null
          role: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          order_display?: number | null
          photo_url?: string | null
          role: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          order_display?: number | null
          photo_url?: string | null
          role?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      performance_videos: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          file_format: string | null
          file_size: number | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          video_url: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          video_url: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          contestant_id: string
          created_at: string
          id: string
          voter_ip: string
          voter_session: string | null
          vote_type: string | null
          amount_paid: number | null
          payment_reference: string | null
          payment_method: string | null
        }
        Insert: {
          contestant_id: string
          created_at?: string
          id?: string
          voter_ip: string
          voter_session?: string | null
          vote_type?: string | null
          amount_paid?: number | null
          payment_reference?: string | null
          payment_method?: string | null
        }
        Update: {
          contestant_id?: string
          created_at?: string
          id?: string
          voter_ip?: string
          voter_session?: string | null
          vote_type?: string | null
          amount_paid?: number | null
          payment_reference?: string | null
          payment_method?: string | null
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
      jury_members: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string
          photo_url: string | null
          specialty: string | null
          bio: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash: string
          photo_url?: string | null
          specialty?: string | null
          bio?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string
          photo_url?: string | null
          specialty?: string | null
          bio?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          label: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          label?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          label?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      jury_votes: {
        Row: {
          id: string
          jury_member_id: string
          contestant_id: string
          score: number
          comments: string | null
          criteria_scores: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          jury_member_id: string
          contestant_id: string
          score: number
          comments?: string | null
          criteria_scores?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          jury_member_id?: string
          contestant_id?: string
          score?: number
          comments?: string | null
          criteria_scores?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jury_votes_jury_member_id_fkey"
            columns: ["jury_member_id"]
            isOneToOne: false
            referencedRelation: "jury_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jury_votes_contestant_id_fkey"
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
      generate_welcome_image: {
        Args: { prompt_text: string; image_size?: string }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
