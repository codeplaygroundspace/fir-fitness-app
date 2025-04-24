export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exercise_body_section: {
        Row: {
          id: number
          body_section: string
          created_at: string
        }
        Insert: {
          id?: number
          body_section: string
          created_at?: string
        }
        Update: {
          id?: number
          body_section?: string
          created_at?: string
        }
        Relationships: []
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 