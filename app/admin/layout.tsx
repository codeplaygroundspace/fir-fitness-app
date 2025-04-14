import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Back to App</Button>
          </Link>
        </div>
      </div>

      <div className="flex mb-6">
        <nav className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Exercises
          </Link>
          <Link href="/admin/categories" className="text-blue-600 hover:underline">
            Categories
          </Link>
        </nav>
      </div>

      {children}
    </div>
  )
}
