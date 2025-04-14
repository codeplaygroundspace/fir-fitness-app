"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ConfigErrorProps } from "@/lib/types"

export function ConfigError({ message }: ConfigErrorProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-destructive mb-4">Configuration Error</h1>
        <p className="mb-4">{message}</p>
        <p className="text-muted-foreground mb-4">
          Please check your environment variables and make sure Supabase is properly configured.
        </p>
        <Button onClick={() => router.push("/login")} className="w-full">
          Go to Login
        </Button>
      </div>
    </div>
  )
}
