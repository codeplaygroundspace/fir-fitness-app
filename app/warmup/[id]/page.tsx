import { notFound } from "next/navigation"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { DurationLabel } from "@/components/exercises/duration-label"
import { RepsLabel } from "@/components/exercises/reps-label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BackButton } from "@/components/layout/back-button"
import { InstructionsBox } from "@/components/exercises/instructions-box"
import { ExerciseTimer } from "@/components/exercises/exercise-timer"
import { getExerciseById, getRelatedExercises } from "@/lib/api/exercises"
import type { PageParams } from "@/lib/types"

// Add a helper function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null

  // Check if it's already an embed URL
  if (url.includes("youtube.com/embed/")) return url

  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
}

export default async function WarmupPage({ params }: PageParams) {
  // Use our optimized query to fetch only the needed exercise
  const exercise = await getExerciseById(params.id)

  if (!exercise) {
    return notFound()
  }

  // Fetch a small number of related exercises if needed
  const relatedExercises = await getRelatedExercises(exercise.id, exercise.categoryId, 3)

  // Get YouTube embed URL if available
  const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl)

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Image at the top with floating back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <BackButton href="/" />
        </div>
        <Image
          src={exercise.image || "/placeholder.svg?height=500&width=800"}
          alt={exercise.name}
          width={800}
          height={500}
          className="w-full h-[40vh] object-cover"
          unoptimized={!exercise.image.startsWith("/")}
        />
      </div>

      {/* Title and metadata below the image */}
      <div className="px-4 py-4">
        <h1>{capitalizeWords(exercise.name)}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {exercise.duration && <DurationLabel duration={exercise.duration} />}
          {exercise.reps && <RepsLabel reps={exercise.reps} />}
        </div>

        {/* Timer component */}
        {exercise.duration && <ExerciseTimer duration={exercise.duration} />}

        {/* Video section */}
        {exercise.videoUrl && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Video Tutorial</h2>

            {embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  title={`${exercise.name} tutorial`}
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
                  The video for this exercise is currently private or unavailable. Please check back later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Instructions box at the bottom */}
        <InstructionsBox
          description={exercise.description}
          fallback={`Perform this exercise for ${exercise.duration || "30 sec"}. Focus on proper form and controlled movements.`}
        />

        {/* Related exercises section (only if we have related exercises) */}
        {relatedExercises.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Related Exercises</h2>
            <div className="grid grid-cols-3 gap-4">
              {relatedExercises.map((relatedExercise) => (
                <div key={relatedExercise.id} className="text-center">
                  <Image
                    src={relatedExercise.image || "/placeholder.svg"}
                    alt={relatedExercise.name}
                    width={100}
                    height={100}
                    className="rounded-md mx-auto mb-2"
                  />
                  <p className="text-sm truncate">{relatedExercise.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
