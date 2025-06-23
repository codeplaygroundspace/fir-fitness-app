'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getBodySections } from '@/app/actions'

export interface BodySectionFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

export function BodySectionFilter({
  categories,
  selectedCategories,
  onFilterChange,
}: BodySectionFilterProps) {
  // Use a predefined order for body sections (matches database order: upper=1, lower=2, middle=3)
  const bodySectionOrder = ['Upper', 'Lower', 'Middle']

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onFilterChange(selectedCategories.filter(c => c !== category))
    } else {
      onFilterChange([...selectedCategories, category])
    }
  }

  // Case-insensitive check if a category is a body section
  const isBodySection = (category: string) => {
    return bodySectionOrder.some(section => section.toLowerCase() === category.toLowerCase())
  }

  // Identify body region categories (only body sections, no FIR categories)
  const bodyCategories = categories.filter(category => !category.startsWith('FIR:'))

  // Sort body categories according to predefined order
  const sortedBodyCategories = [...bodyCategories].sort((a, b) => {
    // Get matching body sections (case insensitive)
    const aIndex = bodySectionOrder.findIndex(section => section.toLowerCase() === a.toLowerCase())
    const bIndex = bodySectionOrder.findIndex(section => section.toLowerCase() === b.toLowerCase())

    // If both are body sections, sort by predefined order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    // If only a is a body section, a comes first
    if (aIndex !== -1) return -1
    // If only b is a body section, b comes first
    if (bIndex !== -1) return 1
    // If neither is a body section, maintain original order
    return 0
  })

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="font-medium text-sm mr-1">Body:</span>
      {sortedBodyCategories.map(category => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => toggleCategory(category)}
          className={`rounded-full ${
            selectedCategories.includes(category)
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : ''
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
