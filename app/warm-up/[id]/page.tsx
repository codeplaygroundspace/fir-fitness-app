import { CollapsibleBox } from '@/components/common/collapsible-box'
import { BackButton } from '@/components/layout/back-button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null

  // Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) return url

  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url?.match(regExp)

  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
}

export default async function WarmUpPage({ params }: { params: { id: string } }) {
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

    // Get video embed URL if available
    const embedUrl = getYouTubeEmbedUrl(exercise.video_url || null)

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
                    The video for this exercise is currently private or unavailable. Please check
                    back later.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Instructions box at the bottom */}
          <CollapsibleBox title="Instructions">
            <p className="text-muted-foreground">
              {exercise?.description
                ? exercise.description.charAt(0).toUpperCase() + exercise.description.slice(1)
                : 'Perform this exercise with proper form and controlled movements.'}
            </p>
          </CollapsibleBox>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in WarmUpPage:', error)
    return notFound()
  }
}
