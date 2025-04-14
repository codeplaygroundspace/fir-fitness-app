"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EnvChecker() {
  const [showEnv, setShowEnv] = useState(false)

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (hidden)" : "Not set",
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setShowEnv(!showEnv)} variant="outline" className="mb-4">
          {showEnv ? "Hide" : "Show"} Environment Info
        </Button>

        {showEnv && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.NEXT_PUBLIC_SUPABASE_URL}
            </p>
            <p>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}
            </p>
            <p className="mt-4 text-muted-foreground">
              Note: For security reasons, actual key values are not displayed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

