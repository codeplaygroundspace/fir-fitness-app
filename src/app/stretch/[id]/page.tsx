import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getExerciseById } from "@/app/actions"

// Helper function to capitalize the first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default async function StretchDetailPage({ params }: { params: { id: string } }) {
  const exercise = await getExerciseById(Number.parseInt(params.id))

  if (!exercise) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link href="/stretch">
        <Button variant="outline" className="flex items-center gap-2 mb-4 text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Stretches
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">{capitalizeWords(exercise.name)}</h1>

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

      <div className="bg-accent p-4 rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <p className="text-accent-foreground">
          {exercise.description ||
            "Perform this stretch slowly and hold for 15-30 seconds. Focus on breathing deeply and relaxing into the stretch. Do not bounce or push to the point of pain."}
        </p>
      </div>
    </div>
  )
}

