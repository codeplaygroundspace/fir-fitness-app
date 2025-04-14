import { createClient } from "@supabase/supabase-js"

// Create a standalone Supabase client for the login page
export const createLoginClient = () => {
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
