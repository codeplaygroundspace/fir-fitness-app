'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CategoryLabel } from '@/components/exercises/category-label'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { ExerciseVideo } from '@/components/exercises/exercise-video'
import type { ExerciseWithLabels } from '@/lib/types'
import { getBaseUrl } from '@/lib/utils'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WorkoutExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [exercise, setExercise] = useState<ExerciseWithLabels | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        // Get the exercise ID from the URL parameters
        const { id } = await params
        const exerciseId = Number.parseInt(id)

        // Fetch the exercise data from the API using the new utility
        const apiUrl = new URL('/api/exercises', getBaseUrl())
        apiUrl.searchParams.append('id', exerciseId.toString())

        const exerciseResponse = await fetch(apiUrl.toString())

        if (!exerciseResponse.ok) {
          notFound()
          return
        }

        const exerciseData: ExerciseWithLabels = await exerciseResponse.json()
        setExercise(exerciseData)
      } catch (error) {
        console.error('Error fetching exercise:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [params])

  if (loading) {
    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        <div className="animate-pulse">
          <div className="w-full h-[40vh] bg-muted"></div>
          <div className="px-4 py-4">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Image at the top with floating back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <Image
          src={exercise?.image || '/placeholder.svg?height=500&width=800'}
          alt={exercise?.name || 'Workout Exercise'}
          width={800}
          height={500}
          className="w-full h-[40vh] object-cover"
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

        {/* Exercise navigation */}
      </div>
    </div>
  )
}
