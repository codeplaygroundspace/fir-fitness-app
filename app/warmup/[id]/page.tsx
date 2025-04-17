import { DurationLabel } from '@/components/exercises/duration-label'
import { ExerciseTimer } from '@/components/exercises/exercise-timer'
import { InstructionsBox } from '@/components/exercises/instructions-box'
import { RepsLabel } from '@/components/exercises/reps-label'
import { BackButton } from '@/components/layout/back-button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ExerciseWithLabels } from '@/lib/types'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Helper function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null

  // Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) return url

  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url?.match(regExp)

  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null
}

export default async function WarmupPage({
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

    // Fetch all warmup exercises - simplified URL
    const allExercisesUrl = `/api/exercises?type=warmup`
    const allExercisesResponse = await fetch(allExercisesUrl, { cache: 'no-store' })
    
    if (!allExercisesResponse.ok) {
      console.error('Failed to fetch all exercises:', await allExercisesResponse.text())
    }
    
    const allExercises: ExerciseWithLabels[] = await allExercisesResponse.json()

    if (!exercise) {
      return notFound()
    }

    // Get video embed URL if available
    const embedUrl = getYouTubeEmbedUrl(exercise.video_url || null)

    // Format duration and reps for display
    const displayDuration = exercise?.duration
      ? `${exercise.duration} sec`
      : '30 sec'
    const displayReps = exercise?.reps || '4'

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
            unoptimized={
              exercise?.image ? !exercise.image.startsWith('/') : false
            }
          />
        </div>

        {/* Title and metadata below the image */}
        <div className="px-4 py-4">
          <h1>{capitalizeWords(exercise?.name || 'Exercise')}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <DurationLabel duration={displayDuration} />
            <RepsLabel reps={displayReps} />
          </div>

          {/* Timer component */}
          <ExerciseTimer duration={displayDuration} />

          {/* Video section */}
          {exercise?.video_url && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Video Tutorial</h2>

              {embedUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={embedUrl}
                    title={`${exercise?.name || 'Exercise'} tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Video Unavailable</AlertTitle>
                  <AlertDescription>
                    The video for this exercise is currently private or
                    unavailable. Please check back later.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Instructions box at the bottom */}
          <InstructionsBox
            description={exercise?.description || ''}
            fallback={`Perform this exercise for ${displayDuration}. Focus on proper form and controlled movements.`}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in WarmupPage:', error)
    return notFound()
  }
}
