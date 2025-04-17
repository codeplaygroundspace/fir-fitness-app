import { notFound } from 'next/navigation'
import Image from 'next/image'
// Update imports for moved components
import { BackButton } from '@/components/layout/back-button'
import { InstructionsBox } from '@/components/exercises/instructions-box'
import type { ExerciseWithLabels } from '@/lib/types'

// Helper function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default async function StretchDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Get the exercise ID from the URL parameters
  const { id } = params
  const exerciseId = Number.parseInt(id)

  // Fetch the exercise data from the API
  // Simplified URL construction that works in all environments
  const apiUrl = `/api/exercises?id=${exerciseId}`
  
  try {
    const exerciseResponse = await fetch(apiUrl, { cache: 'no-store' })

    if (!exerciseResponse.ok) {
      console.error('Failed to fetch exercise:', await exerciseResponse.text())
      return notFound()
    }

    const exercise: ExerciseWithLabels = await exerciseResponse.json()

    // Fetch all stretch exercises - simplified URL
    const allExercisesUrl = `/api/exercises?type=stretch`
    const allExercisesResponse = await fetch(allExercisesUrl, { cache: 'no-store' })
    
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
          unoptimized={
            exercise?.image ? !exercise.image.startsWith('/') : false
          }
        />
      </div>

        {/* Title and metadata below the image */}
        <div className="px-4 py-4">
          <h1>{capitalizeWords(exercise?.name || 'Stretch Exercise')}</h1>

          {/* Remove the timer component */}

          {/* Instructions box at the bottom */}
          <InstructionsBox
            description={exercise?.description || ''}
            fallback="Perform this stretch slowly and hold for 15-30 seconds. Focus on breathing deeply and relaxing into the stretch. Do not bounce or push to the point of pain."
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in StretchDetailPage:', error)
    return notFound()
  }
}
