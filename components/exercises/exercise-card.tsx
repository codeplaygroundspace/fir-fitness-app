import Link from "next/link"
import ExerciseImage from "@/components/exercises/exercise-image"
import { DurationLabel } from "@/components/exercises/duration-label"
import { RepsLabel } from "@/components/exercises/reps-label"
import { CategoryLabel } from "@/components/exercises/category-label"
import type { ExerciseCardProps } from "@/lib/types"
import { capitalizeFirstLetter } from "@/lib/text-utils"

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
  const formattedName = capitalizeFirstLetter(name)

  return (
    <article className="h-full">
      <Link
        href={`${linkPrefix}/${id}`}
        className="block h-full rounded-lg overflow-hidden bg-card shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
        aria-labelledby={`exercise-title-${id}`}
      >
        <div className="aspect-video relative">
          <ExerciseImage
            src={image}
            alt={`Image showing ${formattedName} exercise`}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h2 id={`exercise-title-${id}`} className="font-heading font-medium text-xl mb-2 text-card-foreground">
            {formattedName}
          </h2>

          {showLabels && (
            <div className="flex flex-wrap gap-4 mt-1" aria-label="Exercise details">
              {duration && <DurationLabel duration={duration} />}
              {reps && <RepsLabel reps={reps} />}
            </div>
          )}

          {showCategories && categories && categories.length > 0 && (
            <div className="flex flex-wrap" aria-label="Exercise categories">
              {categories.map((category, index) => (
                <CategoryLabel key={index} category={category} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
