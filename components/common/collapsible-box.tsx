'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { CollapsibleBoxProps } from '@/lib/types'

export function CollapsibleBox({
  children,
  title = 'Instructions',
  defaultOpen = false,
  className = '',
}: CollapsibleBoxProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const headingId = `${title.toLowerCase().replace(/\s+/g, '-')}-heading`
  const contentId = `${title.toLowerCase().replace(/\s+/g, '-')}-content`

  return (
    <div
      className={`bg-secondary p-4 rounded-md hover:bg-secondary/90 transition-colors mb-2 ${className}`}
    >
      <button
        className="w-full text-left flex justify-between items-center gap-2"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <h2
          id={headingId}
          className="text-lg font-semibold text-secondary-foreground flex-1 m-0 leading-6"
        >
          {title}
        </h2>
        <div className="flex items-center justify-center h-8 w-8" aria-hidden="true">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        <span className="sr-only">
          {isExpanded ? 'Collapse' : 'Expand'} {title}
        </span>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        className={isExpanded ? 'block' : 'hidden'}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
