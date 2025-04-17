import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ 
  children,
  params
}: { 
  children: React.ReactNode
  params?: { id?: string }
}) {
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

      {/* We'll use segment configuration to handle this instead */}

      {children}
    </div>
  )
}
