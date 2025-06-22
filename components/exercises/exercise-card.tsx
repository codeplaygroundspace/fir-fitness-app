import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryLabel } from './category-label'
import { DurationLabel } from './duration-label'
import { RepsLabel } from './reps-label'
import ExerciseImage from './exercise-image'
import { capitalizeFirstLetter } from '@/lib/text-utils'

interface ExerciseCardProps {
  id: number
  name: string
  image: string
  linkPrefix: string
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
  const formattedName = capitalizeFirstLetter(name)

  // Filter FIR categories for debugging
  const firCategories = categories?.filter(cat => cat.startsWith('FIR:')) || []

  return (
    <Card className="h-full">
      <Link
        href={`${linkPrefix}/${id}`}
        className="block h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
        aria-labelledby={`exercise-title-${id}`}
      >
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <ExerciseImage
            src={image}
            alt={`Image showing ${formattedName} exercise`}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-3">
          <h2
            id={`exercise-title-${id}`}
            className="font-heading font-medium text-xl mb-2 text-card-foreground"
          >
            {formattedName}
          </h2>

          {showLabels && (
            <div className="flex flex-wrap gap-4 mt-1 mb-2" aria-label="Exercise details">
              {duration && <DurationLabel duration={duration} />}
              {reps && <RepsLabel reps={reps} />}
            </div>
          )}

          {/* Only render categories section when showCategories is true */}
          {showCategories && (
            <div className="flex flex-wrap mt-2" aria-label="Exercise categories">
              {categories && categories.length > 0 ? (
                categories.map((category, index) => (
                  <CategoryLabel key={index} category={category} />
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No categories available</span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
