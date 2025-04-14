import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/layout/navigation"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ThemeInitScript } from "@/components/theme/theme-init-script"

export const metadata: Metadata = {
  title: "FIT - Fitness App",
  description: "Your personal fitness companion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <main id="main-content" className="pb-16">
              {children}
            </main>
            <Navigation />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'