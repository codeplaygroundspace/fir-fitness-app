import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ExercisesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex mb-6">
        <nav className="flex gap-4">
          <Link 
            href="/admin" 
            className="text-muted-foreground hover:text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Exercises
          </Link>
        </nav>
      </div>

      {children}
    </>
  )
} 