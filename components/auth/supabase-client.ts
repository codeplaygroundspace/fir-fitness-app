import { createClient } from "@supabase/supabase-js"

// Create a standalone Supabase client for the auth provider
export const createAuthClient = () => {
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
export const createMockAuthClient = () => {
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

