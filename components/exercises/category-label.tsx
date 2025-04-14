import type { CategoryLabelProps } from "@/lib/types"

export function CategoryLabel({ category, className = "" }: CategoryLabelProps) {
  // Determine background color based on category using theme variables
  let bgColorClass = "bg-muted text-muted-foreground" // Default using theme variables

  if (category.includes("High")) {
    bgColorClass = "bg-destructive text-destructive-foreground"
  } else if (category.includes("Moderate") || category.includes("Mod")) {
    bgColorClass = "bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50" // Using amber from Tailwind palette
  } else if (category.includes("Low")) {
    bgColorClass = "bg-emerald-500 text-emerald-950 dark:bg-emerald-600 dark:text-emerald-50" // Using emerald from Tailwind palette
  } else if (category.includes("Upper")) {
    bgColorClass = "bg-sky-500 text-sky-950 dark:bg-sky-600 dark:text-sky-50" // Using sky from Tailwind palette
  } else if (category.includes("Middle")) {
    bgColorClass = "bg-purple-500 text-purple-950 dark:bg-purple-600 dark:text-purple-50" // Using purple from Tailwind palette
  } else if (category.includes("Lower")) {
    bgColorClass = "bg-indigo-500 text-indigo-950 dark:bg-indigo-600 dark:text-indigo-50" // Using indigo from Tailwind palette
  }

  return (
    <span className={`text-xs ${bgColorClass} px-3 py-1 rounded-full inline-block mr-1 mb-1 ${className}`}>
      {category}
    </span>
  )
}

