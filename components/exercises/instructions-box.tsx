"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { InstructionsBoxProps } from "@/lib/types"

export function InstructionsBox({ description, fallback }: InstructionsBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const displayText = description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : fallback || "Focus on proper form and controlled movements."

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const headingId = "instructions-heading"
  const contentId = "instructions-content"

  return (
    <div className="bg-secondary p-4 rounded-lg hover:bg-secondary/90 transition-colors">
      <button
        className="w-full text-left flex justify-between items-center"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <h2 id={headingId} className="text-lg font-semibold text-secondary-foreground">
          Instructions
        </h2>
        <span className="flex items-center justify-center h-8 w-8" aria-hidden="true">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
        <span className="sr-only">{isExpanded ? "Collapse" : "Expand"} instructions</span>
      </button>

      <div id={contentId} role="region" aria-labelledby={headingId} className={isExpanded ? "block" : "hidden"}>
        <p className="text-muted-foreground mt-2">{displayText}</p>
      </div>
    </div>
  )
}
