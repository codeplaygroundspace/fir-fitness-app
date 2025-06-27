'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import { CategoryLabel } from '@/components/exercises/category-label'
import { ExerciseVideo } from '@/components/exercises/exercise-video'
import { ExerciseNotesForm } from '@/components/exercises/exercise-notes-form'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserExerciseNote } from '@/app/strengthen/actions'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { BackButton } from '@/components/layout/back-button'

export default function WorkoutExercisePage() {
  const params = useParams()
  const { user } = useAuth()
  const [exercise, setExercise] = useState<ExerciseWithLabels | null>(null)
  const [exerciseNote, setExerciseNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [noteLoading, setNoteLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const exerciseId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (isNaN(exerciseId)) {
      notFound()
      return
    }

    async function fetchExercise() {
      try {
        setLoading(true)

        // Fetch the exercise data from the API
        const apiUrl = new URL(
          '/api/exercises',
          process.env.NEXT_PUBLIC_BASE_URL ||
            (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
        )
        apiUrl.searchParams.append('id', exerciseId.toString())

        const exerciseResponse = await fetch(apiUrl.toString(), {
          cache: 'no-store',
        })

        if (!exerciseResponse.ok) {
          console.error('Failed to fetch exercise:', await exerciseResponse.text())
          notFound()
          return
        }

        const exerciseData: ExerciseWithLabels = await exerciseResponse.json()

        if (!exerciseData) {
          notFound()
          return
        }

        setExercise(exerciseData)
      } catch (error) {
        console.error('Error fetching exercise:', error)
        setError('Failed to load exercise data')
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [exerciseId])

  // Fetch user's note for this exercise
  useEffect(() => {
    if (!user?.id || !exerciseId) {
      setNoteLoading(false)
      return
    }

    async function fetchExerciseNote() {
      try {
        setNoteLoading(true)
        if (user?.id) {
          const note = await getUserExerciseNote(user.id, exerciseId)
          setExerciseNote(note)
        }
      } catch (error) {
        console.error('Error fetching exercise note:', error)
      } finally {
        setNoteLoading(false)
      }
    }

    fetchExerciseNote()
  }, [user?.id, exerciseId])

  if (loading) {
    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        <div className="animate-pulse">
          <div className="w-full h-[40vh] bg-muted"></div>
          <div className="px-4 py-4 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !exercise) {
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
          priority={true}
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

        {/* Exercise Notes Form */}
        <div className="mb-6">
          <ExerciseNotesForm
            userId={user?.id}
            exerciseId={exerciseId}
            initialNote={exerciseNote}
            isLoading={noteLoading}
          />
        </div>

        {/* Video section */}
        <ExerciseVideo
          exerciseName={exercise?.name || 'Workout Exercise'}
          videoUrl={exercise?.video_url}
          videoUrl2={exercise?.video_url_2}
          videoUrl3={exercise?.video_url_3}
        />

      </div>
    </div>
  )
}
