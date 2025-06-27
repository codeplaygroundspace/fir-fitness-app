import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { BackButton } from '@/components/layout/back-button'

interface BodyMuscle {
  id: number
  name: string
  body_section: number
  image_url: string
}

export default async function MuscleGroupPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Get the muscle ID from the URL parameters - await params
    const { id } = await params
    const muscleId = Number.parseInt(id)

    if (isNaN(muscleId)) {
      return notFound()
    }

    // Fetch muscle data and exercises in parallel
    const [muscleResponse, exercisesResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/body-muscles/${muscleId}`,
        {
          cache: 'no-store',
          next: { revalidate: 3600 },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/exercises?type=mobilise`,
        {
          cache: 'no-store',
          next: { revalidate: 3600 },
        }
      ),
    ])

    // Handle muscle data
    let muscleData: BodyMuscle
    if (muscleResponse.ok) {
      muscleData = await muscleResponse.json()
    } else {
      console.error('Failed to fetch muscle data')
      muscleData = {
        id: muscleId,
        name: `Muscle Group ${muscleId}`,
        body_section: 1,
        image_url: '',
      }
    }

    // Handle exercises data
    let exercises: ExerciseWithLabels[] = []
    let error: string | null = null

    if (!exercisesResponse.ok) {
      const errorData = await exercisesResponse.json().catch(() => ({}))
      error = errorData.error || `Failed to load exercises: ${exercisesResponse.status}`
      console.error(`Error loading data for muscle ${muscleId}:`, error)
    } else {
      const allExercises = await exercisesResponse.json()

      // Filter exercises for this specific muscle group
      exercises = allExercises.filter((exercise: ExerciseWithLabels) => {
        // Check body_muscle property first
        const exerciseMuscleId = exercise.body_muscle !== null ? Number(exercise.body_muscle) : null
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
    }

    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        {/* Header image with back button */}
        <div className="relative w-full">
          <div className="absolute top-4 left-4 z-10">
            <BackButton href="/mobilise" />
          </div>
          <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 overflow-hidden">
            {!muscleData?.image_url ? (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            ) : (
              <Image
                src={muscleData.image_url}
                alt={muscleData.name || `Muscle Group ${muscleId}`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority={true}
                unoptimized={!muscleData.image_url.startsWith('/')}
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

          {exercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {exercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  id={exercise.id}
                  name={exercise.name}
                  image={exercise.image}
                  linkPrefix="/mobilise"
                  description={exercise.description}
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
                <Button asChild variant="outline">
                  <a href="/mobilise">Return to Mobilise page</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in MuscleGroupPage:', error)
    return notFound()
  }
}
