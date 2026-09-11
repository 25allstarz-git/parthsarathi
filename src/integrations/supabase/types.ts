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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_log: {
        Row: {
          action: string
          created_at: string
          id: string
          target: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          target?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          target?: string | null
          user_id?: string
        }
        Relationships: []
      }
      case_analyses: {
        Row: {
          case_id: string
          category: string | null
          created_at: string
          extracted_facts: Json
          id: string
          key_dates: Json
          legal_insights: Json
          model: string | null
          parties: Json
          precedents: Json
          recommended_specializations: string[]
          similar_cases: Json
          summary: string
          urgency: Database["public"]["Enums"]["case_urgency"] | null
          urgency_reason: string | null
        }
        Insert: {
          case_id: string
          category?: string | null
          created_at?: string
          extracted_facts?: Json
          id?: string
          key_dates?: Json
          legal_insights?: Json
          model?: string | null
          parties?: Json
          precedents?: Json
          recommended_specializations?: string[]
          similar_cases?: Json
          summary?: string
          urgency?: Database["public"]["Enums"]["case_urgency"] | null
          urgency_reason?: string | null
        }
        Update: {
          case_id?: string
          category?: string | null
          created_at?: string
          extracted_facts?: Json
          id?: string
          key_dates?: Json
          legal_insights?: Json
          model?: string | null
          parties?: Json
          precedents?: Json
          recommended_specializations?: string[]
          similar_cases?: Json
          summary?: string
          urgency?: Database["public"]["Enums"]["case_urgency"] | null
          urgency_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_analyses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          case_id: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          ocr_text: string | null
          page_count: number | null
          size_bytes: number
          storage_path: string | null
          uploaded_by: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          ocr_text?: string | null
          page_count?: number | null
          size_bytes?: number
          storage_path?: string | null
          uploaded_by?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          ocr_text?: string | null
          page_count?: number | null
          size_bytes?: number
          storage_path?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_messages: {
        Row: {
          attachment_name: string | null
          attachment_path: string | null
          body: string
          case_id: string
          created_at: string
          id: string
          sender_id: string
          sender_name: string
          sender_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          attachment_name?: string | null
          attachment_path?: string | null
          body?: string
          case_id: string
          created_at?: string
          id?: string
          sender_id: string
          sender_name?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          attachment_name?: string | null
          attachment_path?: string | null
          body?: string
          case_id?: string
          created_at?: string
          id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "case_messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_requests: {
        Row: {
          case_id: string
          citizen_id: string | null
          created_at: string
          id: string
          lawyer_id: string | null
          lawyer_profile_id: string | null
          note: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          case_id: string
          citizen_id?: string | null
          created_at?: string
          id?: string
          lawyer_id?: string | null
          lawyer_profile_id?: string | null
          note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          case_id?: string
          citizen_id?: string | null
          created_at?: string
          id?: string
          lawyer_id?: string | null
          lawyer_profile_id?: string | null
          note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_requests_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_requests_lawyer_profile_id_fkey"
            columns: ["lawyer_profile_id"]
            isOneToOne: false
            referencedRelation: "lawyer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_lawyer_id: string | null
          assigned_lawyer_profile_id: string | null
          case_number: string
          category: string
          citizen_id: string | null
          court: string | null
          created_at: string
          description: string | null
          filed_on: string | null
          filing_number: string | null
          id: string
          is_demo: boolean
          next_hearing: string | null
          parties: Json
          processing_stage: string
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["case_urgency"]
        }
        Insert: {
          assigned_lawyer_id?: string | null
          assigned_lawyer_profile_id?: string | null
          case_number: string
          category?: string
          citizen_id?: string | null
          court?: string | null
          created_at?: string
          description?: string | null
          filed_on?: string | null
          filing_number?: string | null
          id?: string
          is_demo?: boolean
          next_hearing?: string | null
          parties?: Json
          processing_stage?: string
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["case_urgency"]
        }
        Update: {
          assigned_lawyer_id?: string | null
          assigned_lawyer_profile_id?: string | null
          case_number?: string
          category?: string
          citizen_id?: string | null
          court?: string | null
          created_at?: string
          description?: string | null
          filed_on?: string | null
          filing_number?: string | null
          id?: string
          is_demo?: boolean
          next_hearing?: string | null
          parties?: Json
          processing_stage?: string
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["case_urgency"]
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_lawyer_profile_id_fkey"
            columns: ["assigned_lawyer_profile_id"]
            isOneToOne: false
            referencedRelation: "lawyer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      citizen_verifications: {
        Row: {
          consent_given_at: string
          created_at: string
          identifier_hash: string
          masked_identifier: string
          method: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          consent_given_at?: string
          created_at?: string
          identifier_hash: string
          masked_identifier: string
          method?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          consent_given_at?: string
          created_at?: string
          identifier_hash?: string
          masked_identifier?: string
          method?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      hearings: {
        Row: {
          case_id: string | null
          case_number: string
          court: string
          court_room: string | null
          created_at: string
          hearing_date: string
          hearing_time: string | null
          id: string
          item_no: number | null
          judge_name: string | null
          party_name: string | null
          purpose: string | null
          status: string
        }
        Insert: {
          case_id?: string | null
          case_number: string
          court: string
          court_room?: string | null
          created_at?: string
          hearing_date: string
          hearing_time?: string | null
          id?: string
          item_no?: number | null
          judge_name?: string | null
          party_name?: string | null
          purpose?: string | null
          status?: string
        }
        Update: {
          case_id?: string | null
          case_number?: string
          court?: string
          court_room?: string | null
          created_at?: string
          hearing_date?: string
          hearing_time?: string | null
          id?: string
          item_no?: number | null
          judge_name?: string | null
          party_name?: string | null
          purpose?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hearings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lawyer_profiles: {
        Row: {
          bar_council_id: string | null
          bio: string | null
          cases_handled: number
          city: string | null
          consultation_fee: number
          court: string | null
          created_at: string
          experience_years: number
          full_name: string
          id: string
          is_available: boolean
          languages: string[]
          rating: number
          specializations: string[]
          success_rate: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bar_council_id?: string | null
          bio?: string | null
          cases_handled?: number
          city?: string | null
          consultation_fee?: number
          court?: string | null
          created_at?: string
          experience_years?: number
          full_name: string
          id?: string
          is_available?: boolean
          languages?: string[]
          rating?: number
          specializations?: string[]
          success_rate?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bar_council_id?: string | null
          bio?: string | null
          cases_handled?: number
          city?: string | null
          consultation_fee?: number
          court?: string | null
          created_at?: string
          experience_years?: number
          full_name?: string
          id?: string
          is_available?: boolean
          languages?: string[]
          rating?: number
          specializations?: string[]
          success_rate?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lawyer_verification_requests: {
        Row: {
          applicant_email: string | null
          bar_council_number: string
          created_at: string
          document_name: string | null
          document_path: string | null
          full_name: string
          id: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["verification_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          applicant_email?: string | null
          bar_council_number: string
          created_at?: string
          document_name?: string | null
          document_path?: string | null
          full_name: string
          id?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          applicant_email?: string | null
          bar_council_number?: string
          created_at?: string
          document_name?: string | null
          document_path?: string | null
          full_name?: string
          id?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          case_id: string | null
          created_at: string
          id: string
          is_read: boolean
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      precedents: {
        Row: {
          category: string
          citation: string
          court: string
          created_at: string
          holding: string
          id: string
          relevance_note: string | null
          title: string
          year: number
        }
        Insert: {
          category: string
          citation: string
          court: string
          created_at?: string
          holding: string
          id?: string
          relevance_note?: string | null
          title: string
          year: number
        }
        Update: {
          category?: string
          citation?: string
          court?: string
          created_at?: string
          holding?: string
          id?: string
          relevance_note?: string | null
          title?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          advocate_code: string | null
          created_at: string
          credential_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          advocate_code?: string | null
          created_at?: string
          credential_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          advocate_code?: string | null
          created_at?: string
          credential_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_case: { Args: { _case_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_verified_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      register_role: {
        Args: {
          _credential_id?: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: {
          advocate_code: string | null
          created_at: string
          credential_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        SetofOptions: {
          from: "*"
          to: "user_roles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_to_case: {
        Args: {
          _case_id: string
          _decision: Database["public"]["Enums"]["request_status"]
          _note?: string
        }
        Returns: {
          assigned_lawyer_id: string | null
          assigned_lawyer_profile_id: string | null
          case_number: string
          category: string
          citizen_id: string | null
          court: string | null
          created_at: string
          description: string | null
          filed_on: string | null
          filing_number: string | null
          id: string
          is_demo: boolean
          next_hearing: string | null
          parties: Json
          processing_stage: string
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["case_urgency"]
        }
        SetofOptions: {
          from: "*"
          to: "cases"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      review_lawyer_application: {
        Args: {
          _decision: Database["public"]["Enums"]["verification_status"]
          _note?: string
          _user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "citizen" | "lawyer" | "judge" | "law_enforcement" | "admin"
      case_status: "pending" | "active" | "assigned" | "closed"
      case_urgency: "critical" | "high" | "medium" | "low"
      request_status: "pending" | "accepted" | "rejected"
      verification_status: "pending" | "verified" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["citizen", "lawyer", "judge", "law_enforcement", "admin"],
      case_status: ["pending", "active", "assigned", "closed"],
      case_urgency: ["critical", "high", "medium", "low"],
      request_status: ["pending", "accepted", "rejected"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
