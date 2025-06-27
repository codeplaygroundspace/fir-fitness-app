import { BackButton } from '@/components/layout/back-button'
import { ExerciseVideo } from '@/components/exercises/exercise-video'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function WarmUpPage({ params }: { params: Promise<{ id: string }> }) {
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
            <BackButton href="/" />
          </div>
          <Image
            src={exercise?.image || '/placeholder.svg?height=500&width=800'}
            alt={exercise?.name || 'Exercise'}
            width={800}
            height={500}
            className="w-full h-[40vh] object-cover"
            priority={true} // Add priority for LCP optimization
            unoptimized={exercise?.image ? !exercise.image.startsWith('/') : false}
          />
        </div>

        {/* Title and metadata below the image */}
        <div className="px-4 py-4">
          <h1>{capitalizeFirstLetter(exercise?.name || 'Exercise')}</h1>

          {/* Video section */}
          <ExerciseVideo
            exerciseName={exercise?.name || 'Exercise'}
            videoUrl={exercise?.video_url}
            videoUrl2={exercise?.video_url_2}
            videoUrl3={exercise?.video_url_3}
          />

        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in WarmUpPage:', error)
    return notFound()
  }
}
