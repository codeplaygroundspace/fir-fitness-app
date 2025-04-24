"use client"

import { useState } from "react"
import { BodySectionFilter } from "@/components/exercises/body-section-filter"
import { FIRFilter } from "@/components/exercises/fir-filter"

export interface ExerciseFiltersProps {
  categories: string[]
  onFilterChange: (selectedCategories: string[]) => void
}

export function ExerciseFilters({ 
  categories, 
  onFilterChange 
}: ExerciseFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Handle filter changes from either component
  const handleFilterChange = (newSelected: string[]) => {
    setSelectedCategories(newSelected)
    onFilterChange(newSelected)
  }
  
  return (
    <div className="mb-4 space-y-3">
      <BodySectionFilter 
        categories={categories} 
        selectedCategories={selectedCategories}
        onFilterChange={handleFilterChange} 
      />
      <FIRFilter 
        categories={categories} 
        selectedCategories={selectedCategories}
        onFilterChange={handleFilterChange} 
      />
    </div>
  )
} 