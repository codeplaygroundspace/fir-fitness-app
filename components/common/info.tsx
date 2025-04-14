import type { InfoProps } from "@/lib/types"

export function Info({ children, className = "" }: InfoProps) {
  return <div className={`bg-muted p-4 rounded-lg mb-6 shadow-sm ${className}`}>{children}</div>
}

