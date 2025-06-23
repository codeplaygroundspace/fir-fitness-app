import Link from 'next/link'
import ExerciseImage from '@/components/exercises/exercise-image'
import { CategoryLabel } from '@/components/exercises/category-label'
import { Card, CardContent } from '@/components/ui/card'
import type { ExerciseCardProps } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export function ExerciseCard({
  id,
  name,
  image,
  linkPrefix,
  categories,
  showLabels = false,
  showCategories = false,
}: ExerciseCardProps) {
  const formattedName = capitalizeFirstLetter(name)

  // Debug categories
  console.log(
    `Exercise card ${id} (${name}) categories:`,
    categories,
    'showCategories:',
    showCategories
  )

  // Log any FIR categories
  const firCategories = categories?.filter(c => c.startsWith('FIR:')) || []
  if (firCategories.length > 0) {
    console.log(`Exercise ${name} has FIR categories:`, firCategories)
  }

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
