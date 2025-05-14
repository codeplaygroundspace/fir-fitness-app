'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GrYoga } from 'react-icons/gr'
import { GiJumpAcross } from 'react-icons/gi'
import { IoIosFitness } from 'react-icons/io'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaWind } from 'react-icons/fa'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Check if current page is a details page or login
  const isDetailsPage = () => {
    // Main section pages that should have navigation
    const mainPages = ['/', '/mobilise', '/strengthen', '/recover', '/record']

    // Check if the pathname exactly matches one of our main pages
    if (mainPages.includes(pathname)) {
      return false
    }

    // For all other paths, consider them internal/detail pages
    return true
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
              className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <GiJumpAcross className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Warm up</span>
            </Link>
          </li>

          <li>
            <Link
              href="/mobilise"
              className={`flex flex-col items-center p-2 ${
                isActive('/mobilise') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
              aria-current={isActive('/mobilise') ? 'page' : undefined}
            >
              <GrYoga className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Mobilise</span>
            </Link>
          </li>

          <li>
            <Link
              href="/strengthen"
              className={`flex flex-col items-center p-2 ${isActive('/strengthen') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              aria-current={isActive('/strengthen') ? 'page' : undefined}
            >
              <IoIosFitness className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Strengthen</span>
            </Link>
          </li>

          <li>
            <Link
              href="/recover"
              className={`flex flex-col items-center p-2 ${isActive('/recover') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              aria-current={isActive('/recover') ? 'page' : undefined}
            >
              <FaWind className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Recover</span>
            </Link>
          </li>

          <li>
            <Link
              href="/record"
              className={`flex flex-col items-center p-2 ${
                isActive('/record') ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
              aria-current={isActive('/record') ? 'page' : undefined}
            >
              <BsFillPersonFill className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1">Record</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
