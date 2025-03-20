"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BinaryIcon as RunningIcon, Dumbbell, User2 } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Check if current page is a details page
  const isDetailsPage = () => {
    return pathname.startsWith("/exercise/") || pathname.startsWith("/stretch/") || pathname.startsWith("/fit/")
  }

  // Don't render navigation on details pages
  if (isDetailsPage()) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className={`flex flex-col items-center p-2 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
          >
            <RunningIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Warmup</span>
          </Link>

          <Link
            href="/stretch"
            className={`flex flex-col items-center p-2 ${
              isActive("/stretch") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM10 18a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM15 13l-3-3M14 6l-4 4M10 14l-4 4" />
            </svg>
            <span className="text-xs mt-1">Stretch</span>
          </Link>

          <Link
            href="/fit"
            className={`flex flex-col items-center p-2 ${isActive("/fit") ? "text-primary" : "text-muted-foreground"}`}
          >
            <Dumbbell className="h-6 w-6" />
            <span className="text-xs mt-1">FIT</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center p-2 ${
              isActive("/profile") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User2 className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

