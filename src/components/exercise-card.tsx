import Link from "next/link"
import ExerciseImage from "@/components/exercise-image"
import { DurationLabel } from "@/components/duration-label"
import { RepsLabel } from "@/components/reps-label"
import { CategoryLabel } from "@/components/category-label"

// Helper function to capitalize only the first letter of the sentence
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

interface ExerciseCardProps {
  id: number
  name: string
  image: string
  linkPrefix: string // e.g., "/exercise", "/stretch", "/fit"
  duration?: string | null
  reps?: string | null
  categories?: string[]
  showLabels?: boolean
  showCategories?: boolean
}

export function ExerciseCard({
  id,
  name,
  image,
  linkPrefix,
  duration,
  reps,
  categories,
  showLabels = false,
  showCategories = false,
}: ExerciseCardProps) {
  return (
    <Link href={`${linkPrefix}/${id}`} className="block">
      <div className="rounded-lg overflow-hidden h-full bg-card shadow-md">
        <div className="aspect-video relative">
          <ExerciseImage src={image} alt={name} width={300} height={200} className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
          <h2 className="font-medium text-md mb-2">{capitalizeFirstLetter(name)}</h2>

          {showLabels && (
            <div className="flex flex-wrap gap-4 mt-1">
              {duration && <DurationLabel duration={duration} />}
              {reps && <RepsLabel reps={reps} />}
            </div>
          )}

          {showCategories && categories && categories.length > 0 && (
            <div className="flex flex-wrap">
              {categories.map((category, index) => (
                <CategoryLabel key={index} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

