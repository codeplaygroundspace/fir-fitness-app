"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getBodySections } from "@/app/actions"

export interface BodySectionFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

export function BodySectionFilter({ 
  categories, 
  selectedCategories, 
  onFilterChange 
}: BodySectionFilterProps) {
  const [bodySections, setBodySections] = useState<string[]>([])

  // Fetch body sections from server action
  useEffect(() => {
    const fetchBodySections = async () => {
      try {
        const sections = await getBodySections()
        console.log('Fetched body sections:', sections)
        setBodySections(sections)
      } catch (error) {
        console.error('Error fetching body sections:', error)
        // Fallback to some default order if fetch fails
        setBodySections(['lower', 'middle', 'upper'])
      }
    }

    fetchBodySections()
  }, [])

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onFilterChange(selectedCategories.filter(c => c !== category))
    } else {
      onFilterChange([...selectedCategories, category])
    }
  }

  // Case-insensitive check if a category is a body section
  const isBodySection = (category: string) => {
    return bodySections.some(section => 
      section.toLowerCase() === category.toLowerCase()
    )
  }

  // Identify body region categories
  const bodyCategories = categories.filter(category => 
    isBodySection(category) || 
    (!category.startsWith("FIR:") && category)
  );
  
  // Sort body categories according to order from database
  const sortedBodyCategories = [...bodyCategories].sort((a, b) => {
    // Get matching body sections (case insensitive)
    const aIndex = bodySections.findIndex(section => 
      section.toLowerCase() === a.toLowerCase()
    );
    const bIndex = bodySections.findIndex(section => 
      section.toLowerCase() === b.toLowerCase()
    );
    
    // If both are body sections, sort by database order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only a is a body section, a comes first
    if (aIndex !== -1) return -1;
    // If only b is a body section, b comes first
    if (bIndex !== -1) return 1;
    // If neither is a body section, maintain original order
    return 0;
  });

  console.log('Body section filter - categories:', sortedBodyCategories);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="font-medium text-sm mr-1">Body:</span>
      {sortedBodyCategories.map((category) => (
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
  )
} 