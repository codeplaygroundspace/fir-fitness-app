"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { BackButtonProps } from "@/lib/types"

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </Link>
  )
}
