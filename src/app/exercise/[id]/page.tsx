import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { DurationLabel } from "@/components/duration-label"
import { RepsLabel } from "@/components/reps-label"
import { supabaseServer } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

  // Get duration label
  const { data: durationLabels } = await supabaseServer
    .from("exercise_labels")
    .select("*")
    .eq("label_type", "duration")
    .limit(1)

  // Get reps label
  const { data: repsLabels } = await supabaseServer
    .from("exercise_labels")
    .select("*")
    .eq("label_type", "reps")
    .limit(1)

  const duration = durationLabels && durationLabels.length > 0 ? durationLabels[0].label_name + " sec" : "30 sec"
  const reps = repsLabels && repsLabels.length > 0 ? repsLabels[0].label_name : "4"

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

export default async function ExercisePage({ params }: { params: { id: string } }) {
  const exercise = await getExerciseData(params.id)

  if (!exercise) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2 mb-4 text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Warmup
        </Button>
      </Link>

      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold">{capitalizeWords(exercise.name)}</h1>
        <div className="flex flex-wrap gap-4 mt-1">
          <DurationLabel duration={exercise.duration} />
          <RepsLabel reps={exercise.reps || "4"} />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden mb-6">
        <Image
          src={exercise.image || "/placeholder.svg?height=500&width=800"}
          alt={exercise.name}
          width={800}
          height={500}
          className="w-full h-auto"
          unoptimized={!exercise.image.startsWith("/")}
        />
      </div>

      <div className="bg-secondary p-4 rounded-lg mb-6 border border-border">
        <h2 className="text-lg font-semibold mb-2 text-secondary-foreground">Instructions</h2>
        <p className="text-muted-foreground">
          {exercise.description
            ? exercise.description.charAt(0).toUpperCase() + exercise.description.slice(1)
            : `Perform this exercise for ${exercise.duration}. Focus on proper form and controlled movements.`}
        </p>
      </div>

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
    </div>
  )
}

