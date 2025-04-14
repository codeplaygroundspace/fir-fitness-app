import { notFound } from "next/navigation"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { DurationLabel } from "@/components/exercises/duration-label"
import { RepsLabel } from "@/components/exercises/reps-label"
import { supabaseServer } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BackButton } from "@/components/layout/back-button"
import { InstructionsBox } from "@/components/exercises/instructions-box"
import { ExerciseTimer } from "@/components/exercises/exercise-timer"
import { getWarmupExercises } from "@/app/actions"

// Helper function to capitalize the first letter of each word
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

async function getExerciseData(id: string) {
  const { data: exercise, error } = await supabaseServer
    .from("exercises")
    .select("*, categories(name)")
    .eq("id", id)
    .single()

  if (error || !exercise) {
    console.error("Error fetching exercise:", error)
    return null
  }

  // Use the reps and duration directly from the exercises table
  const duration = exercise.duration ? exercise.duration + " sec" : "30 sec"
  const reps = exercise.reps || "4"

  return {
    id: exercise.id,
    name: exercise.name,
    image: exercise.image_url || "/placeholder.svg?height=200&width=300",
    description: exercise.ex_description,
    videoUrl: exercise.video_url,
    embedUrl: getYouTubeEmbedUrl(exercise.video_url),
    duration,
    reps,
    category: exercise.categories?.name,
  }
}

// Use any type to bypass TypeScript errors
export default async function WarmupPage(props: any) {
  const { params } = props
  const exercise = await getExerciseData(params.id)
  const allExercises = await getWarmupExercises()

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
          <DurationLabel duration={exercise.duration} />
          <RepsLabel reps={exercise.reps || "4"} />
        </div>

        {/* Timer component */}
        <ExerciseTimer duration={exercise.duration} />

        {/* Video section */}
        {exercise.videoUrl && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Video Tutorial</h2>

            {exercise.embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={exercise.embedUrl}
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
          fallback={`Perform this exercise for ${exercise.duration}. Focus on proper form and controlled movements.`}
        />
      </div>
    </div>
  )
}
