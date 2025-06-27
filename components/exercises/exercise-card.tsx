import Link from 'next/link'
import ExerciseImage from '@/components/exercises/exercise-image'
import { Card, CardContent } from '@/components/ui/card'
import type { ExerciseCardProps } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export function ExerciseCard({ id, name, image, linkPrefix, description }: ExerciseCardProps) {
  const formattedName = capitalizeFirstLetter(name)

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
          {description && description.trim() !== '' && description !== 'No description available' && (
            <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
              {description.charAt(0).toUpperCase() + description.slice(1)}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
