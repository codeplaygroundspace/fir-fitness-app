import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types"

// Create a single supabase client for server-side
export const supabaseServer = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      persistSession: true,
    },
  },
)

// Create a singleton for client-side to prevent multiple instances
let clientSingleton: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseBrowser = () => {
  // Only run this in the browser
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be called in the browser")
  }

  if (clientSingleton) return clientSingleton

  // Directly use the values from the environment variables
  // This is safer than relying on process.env which might not be available at runtime
  const supabaseUrl = "https://nadfduujsmcwckcdsmlb.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing")
    throw new Error("Supabase configuration is missing. Please check your environment variables.")
  }

  try {
    clientSingleton = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "fit-app-auth",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })

    return clientSingleton
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// Create a mock client for testing or when real client can't be initialized
export const createMockSupabaseClient = () => {
  console.warn("Using mock Supabase client")

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({
        data: { session: null },
        error: new Error("Mock client cannot authenticate"),
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error("Mock client cannot fetch data") }),
          limit: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        in: () => ({ data: [], error: null }),
      }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => {},
  }
}

