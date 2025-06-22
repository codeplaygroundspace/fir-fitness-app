'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'

interface BodyMuscle {
  id: number
  name: string
  body_section: number
  image_url: string
}

export default function MuscleGroupPage() {
  const params = useParams()
  const router = useRouter()
  const muscleId = Number(params.id)

  const [exercises, setExercises] = useState<ExerciseWithLabels[]>([])
  const [muscleData, setMuscleData] = useState<BodyMuscle | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMuscleData = async () => {
      try {
        setLoading(true)
        setImageLoading(true)

        if (isNaN(muscleId)) {
          setError('Invalid muscle ID')
          return
        }

        // Fetch muscle data
        const muscleResponse = await fetch(`/api/body-muscles/${muscleId}`)
        if (muscleResponse.ok) {
          const muscle = await muscleResponse.json()
          setMuscleData(muscle)
        } else {
          console.error('Failed to fetch muscle data')
          setMuscleData({
            id: muscleId,
            name: `Muscle Group ${muscleId}`,
            body_section: 1,
            image_url: '',
          })
        }

        // Fetch mobilise exercises for this muscle group
        const exercisesResponse = await fetch('/api/exercises?type=mobilise')

        if (!exercisesResponse.ok) {
          const errorData = await exercisesResponse.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Failed to load exercises: ${exercisesResponse.status}`
          )
        }

        const allExercises = await exercisesResponse.json()

        // Filter exercises for this specific muscle group
        const filteredExercises = allExercises.filter((exercise: ExerciseWithLabels) => {
          // Check body_muscle property first
          const exerciseMuscleId =
            exercise.body_muscle !== null ? Number(exercise.body_muscle) : null
          if (exerciseMuscleId === muscleId) {
            return true
          }

          // Then check name for muscle group indicators
          if (exercise.name) {
            // Look for patterns like "- 5", "(5)", " 5" at the end of the name
            const namePatterns = [
              new RegExp(`- ${muscleId}(\\s|$)`),
              new RegExp(`\\(${muscleId}\\)`),
              new RegExp(`\\s${muscleId}$`),
            ]

            return namePatterns.some(pattern => pattern.test(exercise.name))
          }

          return false
        })

        setExercises(filteredExercises)
      } catch (error) {
        console.error(`Error loading data for muscle ${muscleId}:`, error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setLoading(false)
        setImageLoading(false)
      }
    }

    if (muscleId) {
      loadMuscleData()
    }
  }, [muscleId])

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Header image with back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 overflow-hidden">
          {imageLoading ? (
            <ImageLoading />
          ) : imageError ? (
            <ImageError message={imageError} />
          ) : !muscleData?.image_url ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={muscleData.image_url}
              alt={muscleData.name || `Muscle Group ${muscleId}`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
              onError={() => setImageError('Failed to load image')}
            />
          )}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {capitalizeFirstLetter(muscleData?.name || `Muscle Group ${muscleId}`)}
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                <div className="aspect-video bg-muted-foreground/20"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/mobilise"
                duration={exercise.duration}
                categories={exercise.categories}
                showLabels={false}
                showCategories={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No exercises found for {muscleData?.name || `muscle group ${muscleId}`}.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                There are currently no mobilise exercises available for this muscle group.
              </p>
              <Button onClick={() => router.push('/mobilise')} variant="outline">
                Return to Mobilise page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
