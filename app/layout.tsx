import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
// Update imports for moved components
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:p-4 focus:block focus:bg-background focus:text-foreground focus:fixed focus:z-50 focus:top-0 focus:left-0 focus:m-4 focus:rounded focus-ring"
        >
          Skip to main content
        </a>
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