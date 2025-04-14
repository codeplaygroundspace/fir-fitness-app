"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLoginClient } from "./supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  // Initialize Supabase client
  useEffect(() => {
    try {
      // Only initialize in the browser
      if (typeof window !== "undefined") {
        const client = createLoginClient()
        setSupabase(client)
      }
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err)
      setInitError(err instanceof Error ? err.message : "Failed to initialize Supabase client")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      setError("Supabase client is not initialized. Please check your configuration.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Make sure we have a session before redirecting
      if (data.session) {
        console.log("Login successful, redirecting to home page")
        // Use router.push instead of replace to ensure proper navigation
        router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error?.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-[350px] mb-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" id="login-heading">
            Welcome to FIT
          </CardTitle>
          <CardDescription>Sign in to access your fitness app</CardDescription>
        </CardHeader>
        <CardContent>
          {(error || initError) && (
            <div
              className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {initError ? (
                <>
                  <p className="font-bold mb-1">Configuration Error:</p>
                  <p>{initError}</p>
                  <p className="mt-2 text-xs">Please check your environment variables.</p>
                </>
              ) : (
                error
              )}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4" aria-labelledby="login-heading" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                aria-required="true"
                autoComplete="email"
                disabled={isLoading || !!initError}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                autoComplete="current-password"
                disabled={isLoading || !!initError}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !!initError} aria-busy={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
