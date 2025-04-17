import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CategoryLabel } from '@/components/exercises/category-label'
import { BackButton } from '@/components/layout/back-button'
import { InstructionsBox } from '@/components/exercises/instructions-box'
import type { ExerciseWithLabels } from '@/lib/types'
import { getBaseUrl } from '@/lib/utils'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export default async function FitExercisePage({
  params,
}: {
  params: { id: string }
}) {
  // Get the exercise ID from the URL parameters
  const { id } = await params
  const exerciseId = Number.parseInt(id)

  // Fetch the exercise data from the API using the new utility
  const apiUrl = new URL('/api/exercises', getBaseUrl())
  apiUrl.searchParams.append('id', exerciseId.toString())

  const exerciseResponse = await fetch(apiUrl.toString())

  if (!exerciseResponse.ok) {
    return notFound()
  }

  const exercise: ExerciseWithLabels = await exerciseResponse.json()

  // Fetch all fit exercises to show related exercises
  const allExercisesUrl = new URL(
    '/api/exercises',
    process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000')
  )
  allExercisesUrl.searchParams.append('type', 'fit')

  const allExercisesResponse = await fetch(allExercisesUrl.toString())
  const allExercises: ExerciseWithLabels[] = await allExercisesResponse.json()

  if (!exercise) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Image at the top with floating back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <BackButton href="/fit" />
        </div>
        <Image
          src={exercise?.image || '/placeholder.svg?height=500&width=800'}
          alt={exercise?.name || 'Fit Exercise'}
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
        <h1>{capitalizeFirstLetter(exercise?.name || 'Fit Exercise')}</h1>
        <div className="flex flex-wrap mb-6">
          {Array.isArray(exercise?.categories) &&
            exercise.categories.map((category, index) => (
              <CategoryLabel key={index} category={category} />
            ))}
        </div>

        {/* Remove the timer component */}

        {/* Instructions box at the bottom */}
        <InstructionsBox
          description={exercise?.description || ''}
          fallback="Focus on proper form and controlled movements. Adjust your effort level based on your Functional Imbalance Risk (FIR) indicators."
        />

        {/* Exercise navigation */}
      </div>
    </div>
  )
}
