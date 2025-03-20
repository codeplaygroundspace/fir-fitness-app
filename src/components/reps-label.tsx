import type React from "react"
import { Repeat } from "lucide-react"

interface RepsLabelProps {
  reps: string | number
  className?: string
  icon?: React.ReactNode
}

export function RepsLabel({ reps, className = "", icon }: RepsLabelProps) {
  return (
    <span className={`text-sm text-muted-foreground flex items-center gap-1 ${className}`}>
      {icon || <Repeat className="h-3 w-3 text-muted-foreground" />}
      {reps} reps
    </span>
  )
}

