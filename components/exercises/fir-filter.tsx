"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FIRFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

const FIR_PREFIX = "FIR:";

// Define traffic light color variants using theme colors
const firButtonVariants = {
  high: {
    default: "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50",
    selected: "bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30"
  },
  moderate: {
    default: "border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50",
    selected: "bg-amber-500/20 border-amber-500/50 text-amber-500 hover:bg-amber-500/30"
  },
  low: {
    default: "border-success/30 text-success hover:bg-success/10 hover:border-success/50",
    selected: "bg-success/20 border-success/50 text-success hover:bg-success/30"
  }
};

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

  // Helper function to get appropriate button variant based on the FIR level
  const getButtonClasses = (category: string, isSelected: boolean) => {
    const level = category.replace(FIR_PREFIX, "").trim().toLowerCase();
    const variant = firButtonVariants[level as keyof typeof firButtonVariants];
    
    if (!variant) {
      return isSelected 
        ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20" 
        : "hover:bg-primary/10 hover:text-primary";
    }
    
    return isSelected ? variant.selected : variant.default;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="font-medium text-sm mr-1">Functional Imbalance Risk (FIR):</span>
      {firCategories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        const customClasses = getButtonClasses(category, isSelected);
        
        return (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => toggleCategory(category)}
            className={cn("rounded-full", customClasses)}
          >
            {category.replace(FIR_PREFIX, "").trim()}
          </Button>
        );
      })}
    </div>
  )
} 