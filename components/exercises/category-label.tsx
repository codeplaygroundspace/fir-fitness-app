import type { CategoryLabelProps } from "@/lib/types"

export function CategoryLabel({ category, className = "" }: CategoryLabelProps) {
  // Debug category
  console.log('Rendering CategoryLabel with:', category);
  
  // Default styling using theme variables
  let bgColorClass = "bg-muted text-muted-foreground"

  // Check if it's a body region category
  const isBodyRegion = ["Upper", "Middle", "Lower"].includes(category)
  
  // Check if it's a FIR category
  const isFirCategory = category.startsWith("FIR:")
  
  // Only apply special colors to FIR categories
  if (isFirCategory) {
    if (category.includes("High")) {
      bgColorClass = "bg-destructive text-destructive-foreground font-medium" 
    } else if (category.includes("Moderate") || category.includes("Mod")) {
      bgColorClass = "bg-primary text-primary-foreground font-medium" 
    } else if (category.includes("Low")) {
      bgColorClass = "bg-success text-success-foreground font-medium"
    }
  } else if (!isBodyRegion) {
    // For other non-body categories, keep original styling
    bgColorClass = "bg-secondary text-secondary-foreground"
  }

  // For body regions we keep the default "bg-muted text-muted-foreground"

  return (
    <span className={`text-xs ${bgColorClass} px-3 py-1 rounded-full inline-block mr-2 mb-2 border ${className}`}>
      {category}
    </span>
  )
}
