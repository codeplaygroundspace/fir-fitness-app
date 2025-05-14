import { notFound } from 'next/navigation'
import Image from 'next/image'
// Update imports for moved components
import { BackButton } from '@/components/layout/back-button'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export default async function StretchDetailPage({ params }: { params: { id: string } }) {
  // Get the exercise ID from the URL parameters
  const { id } = await params
  const exerciseId = Number.parseInt(id)

  // Fetch the exercise data from the API using proper URL construction
  const apiUrl = new URL(
    '/api/exercises',
    process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  )
  apiUrl.searchParams.append('id', exerciseId.toString())

  try {
    const exerciseResponse = await fetch(apiUrl.toString(), { cache: 'no-store' })

    if (!exerciseResponse.ok) {
      console.error('Failed to fetch exercise:', await exerciseResponse.text())
      return notFound()
    }

    const exercise: ExerciseWithLabels = await exerciseResponse.json()

    // Fetch all stretch exercises with proper URL construction
    const allExercisesUrl = new URL(
      '/api/exercises',
      process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    )
    allExercisesUrl.searchParams.append('type', 'stretch')

    const allExercisesResponse = await fetch(allExercisesUrl.toString(), { cache: 'no-store' })

    if (!allExercisesResponse.ok) {
      console.error('Failed to fetch all exercises:', await allExercisesResponse.text())
    }

    const allExercises: ExerciseWithLabels[] = await allExercisesResponse.json()

    if (!exercise) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        {/* Image at the top with floating back button */}
        <div className="relative w-full">
          <div className="absolute top-4 left-4 z-10">
            <BackButton href="/stretch" />
          </div>
          <Image
            src={exercise?.image || '/placeholder.svg?height=500&width=800'}
            alt={exercise?.name || 'Stretch Exercise'}
            width={800}
            height={500}
            className="w-full h-[40vh] object-cover"
            unoptimized={exercise?.image ? !exercise.image.startsWith('/') : false}
          />
        </div>

        {/* Title and metadata below the image */}
        <div className="px-4 py-4">
          <h1>{capitalizeFirstLetter(exercise?.name || 'Stretch Exercise')}</h1>

          {/* Remove the timer component */}

          {/* Instructions box at the bottom */}
          <CollapsibleBox title="Instructions">
            <p className="text-muted-foreground">
              {exercise?.description
                ? exercise.description.charAt(0).toUpperCase() + exercise.description.slice(1)
                : 'Perform this stretch slowly and hold for 15-30 seconds. Focus on breathing deeply and relaxing into the stretch. Do not bounce or push to the point of pain.'}
            </p>
          </CollapsibleBox>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in StretchDetailPage:', error)
    return notFound()
  }
}
