import { notFound } from "next/navigation"
import Image from "next/image"
import { CategoryLabel } from "@/components/exercises/category-label"
import { BackButton } from "@/components/layout/back-button"
import { InstructionsBox } from "@/components/exercises/instructions-box"
import { getExerciseById, getFitExercises } from "@/app/actions"

// Helper function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

interface PageParams {
  id: string
}

export default async function FitExercisePage({ params }: { params: PageParams }) {
  const exercise = await getExerciseById(Number.parseInt(params.id))
  const allExercises = await getFitExercises()

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
        <div className="flex flex-wrap mb-6">
          {Array.isArray(exercise.categories) &&
            exercise.categories.map((category, index) => <CategoryLabel key={index} category={category} />)}
        </div>

        {/* Remove the timer component */}

        {/* Instructions box at the bottom */}
        <InstructionsBox
          description={exercise.description}
          fallback="Focus on proper form and controlled movements. Adjust your effort level based on your Functional Imbalance Risk (FIR) indicators."
        />

        {/* Exercise navigation */}
      </div>
    </div>
  )
}
