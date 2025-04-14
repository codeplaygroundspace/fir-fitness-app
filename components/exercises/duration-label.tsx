import { Clock } from "lucide-react"
import type { DurationLabelProps } from "@/lib/types"

export function DurationLabel({ duration, className = "", icon }: DurationLabelProps) {
  return (
    <span className={`text-sm text-muted-foreground flex items-center gap-1 ${className}`}>
      {icon || <Clock className="h-3 w-3 text-muted-foreground" />}
      {duration}
    </span>
  )
}
