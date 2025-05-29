'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirstLetter } from '@/lib/text-utils'

interface BodyMuscle {
  id: number
  name: string
  body_section: number
  image_url: string
}

interface MobiliseExerciseCardProps {
  id: number
  name: string
  image: string
  linkPrefix: string
  categories?: string[]
  showCategories?: boolean
  bodyMuscleId?: number | null
}

export const MobiliseExerciseCard: React.FC<MobiliseExerciseCardProps> = ({
  id,
  name,
  image,
  linkPrefix,
  categories = [],
  showCategories = true,
  bodyMuscleId,
}) => {
  const [bodyMuscle, setBodyMuscle] = useState<BodyMuscle | null>(null)
  const [isLoadingMuscle, setIsLoadingMuscle] = useState(false)

  // Fetch muscle data when bodyMuscleId changes
  useEffect(() => {
    const fetchBodyMuscle = async () => {
      if (!bodyMuscleId) return

      setIsLoadingMuscle(true)
      try {
        const response = await fetch(`/api/body-muscles/${bodyMuscleId}`)
        if (response.ok) {
          const muscle = await response.json()
          setBodyMuscle(muscle)
        }
      } catch (error) {
        console.error('Error fetching body muscle:', error)
      } finally {
        setIsLoadingMuscle(false)
      }
    }

    fetchBodyMuscle()
  }, [bodyMuscleId])

  const formattedName = capitalizeFirstLetter(name)

  return (
    <Card className="h-full">
      <Link
        href={`${linkPrefix}/${id}`}
        className="block h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
        aria-labelledby={`exercise-title-${id}`}
      >
        <div className="aspect-video relative">
          {/* Main exercise image */}
          <Image
            src={image}
            alt={`Image showing ${formattedName} exercise`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Muscle image thumbnail in top-left corner */}
          {bodyMuscle && !isLoadingMuscle && (
            <div className="absolute top-2 left-2 w-40 h-40 rounded-md overflow-hidden border-2 border-white shadow-lg bg-white">
              <Image
                src={bodyMuscle.image_url}
                alt={bodyMuscle.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          )}

          {/* Loading state for muscle image */}
          {isLoadingMuscle && bodyMuscleId && (
            <div className="absolute top-2 left-2 w-40 h-40 rounded-md border-2 border-white shadow-lg bg-white flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <h2
            id={`exercise-title-${id}`}
            className="font-heading font-medium text-xl mb-2 text-card-foreground"
          >
            {formattedName}
          </h2>

          {/* Categories */}
          {showCategories && categories && categories.length > 0 && (
            <div className="flex flex-wrap mt-2" aria-label="Exercise categories">
              {categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 mr-1 mb-1">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Muscle name */}
          {bodyMuscle && (
            <div className="text-sm text-muted-foreground mt-2">
              Target muscles: {bodyMuscle.id} {bodyMuscle.name}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
