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
      deliveries: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          donation_id: string
          id: string
          ngo_id: string | null
          notes: string | null
          pickup_time: string | null
          status: string
          updated_at: string | null
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id: string
          id?: string
          ngo_id?: string | null
          notes?: string | null
          pickup_time?: string | null
          status?: string
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id?: string
          id?: string
          ngo_id?: string | null
          notes?: string | null
          pickup_time?: string | null
          status?: string
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          additional_notes: string | null
          assigned_ngo_id: string | null
          created_at: string | null
          description: string | null
          dietary_info: string | null
          donor_id: string
          expiry_date: string
          food_name: string
          id: string
          matched: boolean | null
          pickup_address: string
          quantity: number
          reserved_at: string | null
          reserved_by: string | null
          status: string | null
          temperature_requirements: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          assigned_ngo_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_info?: string | null
          donor_id: string
          expiry_date: string
          food_name: string
          id?: string
          matched?: boolean | null
          pickup_address: string
          quantity: number
          reserved_at?: string | null
          reserved_by?: string | null
          status?: string | null
          temperature_requirements?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          assigned_ngo_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_info?: string | null
          donor_id?: string
          expiry_date?: string
          food_name?: string
          id?: string
          matched?: boolean | null
          pickup_address?: string
          quantity?: number
          reserved_at?: string | null
          reserved_by?: string | null
          status?: string | null
          temperature_requirements?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          donation_id: string
          id: string
          notes: string | null
          pickup_time: string | null
          request_id: string
          status: string | null
          updated_at: string | null
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id: string
          id?: string
          notes?: string | null
          pickup_time?: string | null
          request_id: string
          status?: string | null
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id?: string
          id?: string
          notes?: string | null
          pickup_time?: string | null
          request_id?: string
          status?: string | null
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          related_to: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          related_to?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          related_to?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          full_name: string | null
          id: string
          organization_name: string | null
          phone: string | null
          updated_at: string | null
          user_type: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          organization_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          additional_notes: string | null
          created_at: string | null
          delivery_address: string
          dietary_restrictions: string | null
          food_type: string
          id: string
          ngo_id: string
          quantity_needed: number
          status: string | null
          unit: string
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string | null
          delivery_address: string
          dietary_restrictions?: string | null
          food_type: string
          id?: string
          ngo_id: string
          quantity_needed: number
          status?: string | null
          unit: string
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string | null
          delivery_address?: string
          dietary_restrictions?: string | null
          food_type?: string
          id?: string
          ngo_id?: string
          quantity_needed?: number
          status?: string | null
          unit?: string
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteers: {
        Row: {
          available: boolean | null
          created_at: string | null
          current_location: string | null
          id: string
          max_distance: number | null
          user_id: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          max_distance?: number | null
          user_id: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          max_distance?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          user_id: string
          title: string
          message: string
          related_to?: string
          related_id?: string
        }
        Returns: string
      }
      reserve_donation: {
        Args: {
          donation_id: string
          ngo_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
