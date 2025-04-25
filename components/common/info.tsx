import type { InfoProps } from "@/lib/types"

export function InfoBox({ children, className = "", title = null }: InfoProps) {
  return (
    <div className={`bg-muted p-4 rounded-lg mb-6 shadow-sm ${className}`}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  )
}

// Export the original Info component for backward compatibility
export const Info = InfoBox;
