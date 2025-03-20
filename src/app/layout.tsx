import type React from "react"
import type { Metadata } from "next"
import { Bebas_Neue, Inconsolata } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { ThemeInitScript } from "./theme-init"

// Define the fonts
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "FIT - Fitness App",
  description: "Your personal fitness companion",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${inconsolata.variable}`}>
      <head>
        <ThemeInitScript />
      </head>
      <body className={inconsolata.className}>
        <div className="min-h-screen bg-background text-foreground">
          <main className="pb-16">{children}</main>
          <Navigation />
        </div>
      </body>
    </html>
  )
}

