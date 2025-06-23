import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CategoryLabel } from '@/components/exercises/category-label'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { ExerciseVideo } from '@/components/exercises/exercise-video'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { BackButton } from '@/components/layout/back-button'

export default async function WorkoutExercisePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Get the exercise ID from the URL parameters - await params to fix the error
    const { id } = await params
    const exerciseId = Number.parseInt(id)

    // Fetch the exercise data from the API using proper URL construction
    const apiUrl = new URL(
      '/api/exercises',
      process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    )
    apiUrl.searchParams.append('id', exerciseId.toString())

    const exerciseResponse = await fetch(apiUrl.toString(), {
      cache: 'no-store',
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!exerciseResponse.ok) {
      console.error('Failed to fetch exercise:', await exerciseResponse.text())
      return notFound()
    }

    const exercise: ExerciseWithLabels = await exerciseResponse.json()

    if (!exercise) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        {/* Image at the top with floating back button */}
        <div className="relative w-full">
          <div className="absolute top-4 left-4 z-10">
            <BackButton href="/strengthen" />
          </div>
          <Image
            src={exercise?.image || '/placeholder.svg?height=500&width=800'}
            alt={exercise?.name || 'Workout Exercise'}
            width={800}
            height={500}
            className="w-full h-[40vh] object-cover"
            priority={true} // Add priority for LCP optimization
            unoptimized={exercise?.image ? !exercise.image.startsWith('/') : false}
          />
        </div>

        {/* Title and metadata below the image */}
        <div className="px-4 py-4">
          <h1>{capitalizeFirstLetter(exercise?.name || 'Workout Exercise')}</h1>
          <div className="flex flex-wrap mb-6">
            {Array.isArray(exercise?.categories) &&
              exercise.categories.map((category, index) => (
                <CategoryLabel key={index} category={category} />
              ))}
          </div>

          {/* Video section */}
          <ExerciseVideo
            exerciseName={exercise?.name || 'Workout Exercise'}
            videoUrl={exercise?.video_url}
            videoUrl2={exercise?.video_url_2}
            videoUrl3={exercise?.video_url_3}
          />

          {/* Instructions box at the bottom */}
          <CollapsibleBox title="Instructions">
            <p className="text-muted-foreground">
              {exercise?.description
                ? exercise.description.charAt(0).toUpperCase() + exercise.description.slice(1)
                : 'Focus on proper form and controlled movements. Adjust your effort level based on your Functional Imbalance Risk (FIR) indicators.'}
            </p>
          </CollapsibleBox>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in WorkoutExercisePage:', error)
    return notFound()
  }
}
