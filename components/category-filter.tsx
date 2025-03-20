"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  onFilterChange: (selectedCategories: string[]) => void
}

export function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Use useEffect to notify parent component of changes
  useEffect(() => {
    onFilterChange(selectedCategories)
  }, [selectedCategories, onFilterChange])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="mb-4">
      <div className="space-y-2 mb-2">
        {/* Body regions row */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium text-sm mr-1">Body:</span>
          {categories
            .filter((category) => ["Upper", "Middle", "Lower"].includes(category))
            .map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => toggleCategory(category)}
                className={`rounded-full ${
                  selectedCategories.includes(category) ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                }`}
              >
                {category}
              </Button>
            ))}
        </div>

        {/* FIR levels row */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium text-sm mr-1">FIR:</span>
          {categories
            .filter((category) => category.includes("FIR:"))
            .map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => toggleCategory(category)}
                className={`rounded-full ${
                  selectedCategories.includes(category) ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                }`}
              >
                {category.replace("FIR: ", "")}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}

