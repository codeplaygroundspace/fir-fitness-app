import { createClient } from "@supabase/supabase-js"

// Types for our database based on the existing tables
export type Database = {
  public: {
    tables: {
      exercises: {
        Row: {
          id: number
          name: string
          category_id: string
          created_at: string
          ex_description: string | null
          image_url: string | null
          video_url: string | null
        }
        Insert: {
          id?: number
          name: string
          category_id: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
        }
        Update: {
          id?: number
          name?: string
          category_id?: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      exercise_labels: {
        Row: {
          id: number
          exercise_id: number | null
          label_name: string
          label_type: string
        }
        Insert: {
          id?: number
          exercise_id?: number | null
          label_name: string
          label_type: string
        }
        Update: {
          id?: number
          exercise_id?: number | null
          label_name?: string
          label_type?: string
        }
      }
    }
  }
}

// Create a single supabase client for server-side
export const supabaseServer = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Create a singleton for client-side to prevent multiple instances
let clientSingleton: ReturnType<typeof createClient<Database>>

export const getSupabaseBrowser = () => {
  if (clientSingleton) return clientSingleton

  clientSingleton = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return clientSingleton
}

