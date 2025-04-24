"use client"

import { Button } from "@/components/ui/button"

export interface FIRFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

const FIR_PREFIX = "FIR:";

export function FIRFilter({ 
  categories, 
  selectedCategories, 
  onFilterChange 
}: FIRFilterProps) {
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onFilterChange(selectedCategories.filter(c => c !== category))
    } else {
      onFilterChange([...selectedCategories, category])
    }
  }

  // Get all FIR categories and normalize them (remove prefix spaces)
  const firCategories = categories
    .filter(category => category.startsWith(FIR_PREFIX))
    .map(category => category.trim());

  console.log('FIR filter - categories:', firCategories);

  if (firCategories.length === 0) {
    return null;
  }

  return (
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
          {category.replace(FIR_PREFIX, "").trim()}
        </Button>
      ))}
    </div>
  )
} 