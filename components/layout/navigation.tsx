"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GrYoga } from "react-icons/gr"
import { GiJumpAcross } from "react-icons/gi"
import { IoIosFitness } from "react-icons/io"
import { BsFillPersonFill } from "react-icons/bs"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Check if current page is a details page or login
  const isDetailsPage = () => {
    return (
      pathname.startsWith("/exercise/") ||
      pathname.startsWith("/stretch/") ||
      pathname.startsWith("/workout/") ||
      pathname === "/login"
    )
  }

  // Don't render navigation on details pages
  if (isDetailsPage()) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border py-2 z-50"
      aria-label="Main navigation"
    >
      <div className="container mx-auto">
        <ul className="flex justify-between items-center">
          <li>
            <Link
              href="/"
              className={`flex flex-col items-center p-2 ${isActive("/") ? "text-primary font-medium" : "text-muted-foreground"}`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <GiJumpAcross className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Warmup</span>
            </Link>
          </li>

          <li>
            <Link
              href="/stretch"
              className={`flex flex-col items-center p-2 ${
                isActive("/stretch") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              aria-current={isActive("/stretch") ? "page" : undefined}
            >
              <GrYoga className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Stretch</span>
            </Link>
          </li>

          <li>
            <Link
              href="/workout"
              className={`flex flex-col items-center p-2 ${isActive("/workout") ? "text-primary font-medium" : "text-muted-foreground"}`}
              aria-current={isActive("/workout") ? "page" : undefined}
            >
              <IoIosFitness className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Workout</span>
            </Link>
          </li>

          <li>
            <Link
              href="/profile"
              className={`flex flex-col items-center p-2 ${
                isActive("/profile") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              aria-current={isActive("/profile") ? "page" : undefined}
            >
              <BsFillPersonFill className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
