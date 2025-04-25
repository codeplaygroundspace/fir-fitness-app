"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { CollapsibleBoxProps } from "@/lib/types"

export function CollapsibleBox({ 
  children, 
  title = "Instructions", 
  defaultOpen = false,
  className = "" 
}: CollapsibleBoxProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const headingId = `${title.toLowerCase().replace(/\s+/g, '-')}-heading`
  const contentId = `${title.toLowerCase().replace(/\s+/g, '-')}-content`

  return (
    <div className={`bg-secondary p-4 rounded-lg hover:bg-secondary/90 transition-colors mb-6 ${className}`}>
      <button
        className="w-full text-left flex justify-between items-center"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <h2 id={headingId} className="text-lg font-semibold text-secondary-foreground">
          {title}
        </h2>
        <span className="flex items-center justify-center h-8 w-8" aria-hidden="true">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
        <span className="sr-only">{isExpanded ? "Collapse" : "Expand"} {title}</span>
      </button>

      <div id={contentId} role="region" aria-labelledby={headingId} className={isExpanded ? "block" : "hidden"}>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  )
}

// Keep the original InstructionsBox for backward compatibility
export function InstructionsBox({ description, fallback }: { description: string | null, fallback?: string }) {
  const displayText = description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : fallback || "Focus on proper form and controlled movements."

  return (
    <CollapsibleBox title="Instructions">
      <p className="text-muted-foreground">{displayText}</p>
    </CollapsibleBox>
  )
}
