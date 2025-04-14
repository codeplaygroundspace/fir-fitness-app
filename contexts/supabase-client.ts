import { createClient } from "@supabase/supabase-js"

// Create a standalone Supabase client for the workout context
export const createWorkoutClient = () => {
  // Directly use the values from the environment variables
  const supabaseUrl = "https://nadfduujsmcwckcdsmlb.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration is missing")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "fit-app-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

// Create a mock client for testing or when real client can't be initialized
export const createMockWorkoutClient = () => {
  console.warn("Using mock Supabase client")

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({ data: [], error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({ error: null }),
      update: () => ({ eq: () => ({ error: null }) }),
      delete: () => ({ eq: () => ({ error: null }) }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => {},
  }
}

