interface CategoryLabelProps {
  category: string
  className?: string
}

export function CategoryLabel({ category, className = "" }: CategoryLabelProps) {
  // Determine background color based on category
  let bgColor = "bg-gray-500" // Default color

  if (category.includes("High")) {
    bgColor = "bg-red-500"
  } else if (category.includes("Moderate") || category.includes("Mod")) {
    bgColor = "bg-yellow-500"
  } else if (category.includes("Low")) {
    bgColor = "bg-green-500"
  } else if (category.includes("Upper")) {
    bgColor = "bg-blue-500"
  } else if (category.includes("Middle")) {
    bgColor = "bg-purple-500"
  } else if (category.includes("Lower")) {
    bgColor = "bg-indigo-500"
  }

  return (
    <span className={`text-xs ${bgColor} text-white px-3 py-1 rounded-full inline-block mr-1 mb-1 ${className}`}>
      {category}
    </span>
  )
}

