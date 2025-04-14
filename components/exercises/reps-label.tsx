import { Repeat } from "lucide-react"
import type { RepsLabelProps } from "@/lib/types"

export function RepsLabel({ reps, className = "", icon }: RepsLabelProps) {
  return (
    <span className={`text-sm text-muted-foreground flex items-center gap-1 ${className}`}>
      {icon || <Repeat className="h-3 w-3 text-muted-foreground" />}
      {reps} reps
    </span>
  )
}
