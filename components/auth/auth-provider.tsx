'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'
import { AuthLoading } from './auth-loading'
import { createAuthClient, createMockAuthClient } from './supabase-client'
import type { AuthContextType } from '@/lib/types'

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize Supabase client
  useEffect(() => {
    try {
      // Only initialize in the browser
      if (typeof window !== 'undefined') {
        const client = createAuthClient()
        setSupabase(client)
      }
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize Supabase client')
      // Set a mock client so the app doesn't crash
      setSupabase(createMockAuthClient())
      setIsLoading(false)
    }
  }, [])

  // Handle authentication
  useEffect(() => {
    if (!supabase) return

    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setError(error instanceof Error ? error.message : 'Failed to get auth session')
        setIsLoading(false)
      }
    }

    getSession()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth state change listener:', error)
      setError(error instanceof Error ? error.message : 'Failed to set up auth listener')
      setIsLoading(false)
      return () => {}
    }
  }, [supabase])

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login' && !error) {
        // Redirect to login if not authenticated
        router.push('/login')
      } else if (user && pathname === '/login') {
        // Redirect to home if already authenticated and on login page
        router.push('/')
      }
    }
  }, [user, isLoading, pathname, router, error])

  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setError(error instanceof Error ? error.message : 'Failed to sign out')
    }
  }

  // Only show loading state when checking auth on non-login pages
  if (isLoading && pathname !== '/login') {
    return <AuthLoading />
  }

  // Show error state if there's an initialization error
  if (error && pathname !== '/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-destructive mb-4">Configuration Error</h1>
          <p className="mb-4">{error}</p>
          <p className="text-muted-foreground mb-4">
            Please check your environment variables and make sure Supabase is properly configured.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
