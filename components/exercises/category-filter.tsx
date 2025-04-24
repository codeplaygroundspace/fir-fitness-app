"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { CategoryFilterProps } from "@/lib/types"

// Constants for the different filter types
const BODY_REGIONS = ["Upper", "Middle", "Lower"];
const FIR_PREFIX = "FIR:";

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

  // Identify body region categories and FIR level categories
  const bodyCategories = categories.filter(category => 
    BODY_REGIONS.includes(category) || 
    (!category.startsWith(FIR_PREFIX) && category)
  );
  
  const firCategories = categories.filter(category => 
    category.startsWith(FIR_PREFIX)
  );

  return (
    <div className="mb-4">
      <div className="space-y-2 mb-2">
        {/* Body regions row */}
        {bodyCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium text-sm mr-1">Body:</span>
            {bodyCategories.map((category) => (
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
        )}

        {/* FIR levels row */}
        {firCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium text-sm mr-1">Functional Imbalance Risk (FIR):</span>
            {firCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => toggleCategory(category)}
                className={`rounded-full ${
                  selectedCategories.includes(category) ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                }`}
              >
                {category.replace(FIR_PREFIX, "")}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
