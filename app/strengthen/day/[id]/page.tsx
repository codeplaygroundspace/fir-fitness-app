'use client'

import { useTrainingDays } from '@/hooks/use-training-days'
import { useUserDayExercises } from '@/hooks/use-user-day-exercises'
import { useAuth } from '@/components/auth/auth-provider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import { useDayImage } from '@/hooks/use-day-image'
import { useState, useEffect, useMemo } from 'react'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export default function DayPage() {
  const params = useParams()
  const router = useRouter()
  const dayId = Number(params.id)
  const { user } = useAuth()
  const { days, loading: daysLoading } = useTrainingDays()
  const { imageUrl, loading, error } = useDayImage(user?.id, dayId)
  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
  } = useUserDayExercises(user?.id, dayId)

  // Verify user has access to this day
  useEffect(() => {
    if (!daysLoading && dayId && !days.includes(dayId)) {
      router.push('/strengthen')
    }
  }, [dayId, days, daysLoading, router])

  // Verify this day is assigned to the user
  const isAssigned = !daysLoading && days.includes(dayId)

  // Get unique exercise groups from the exercises
  const exerciseGroups = useMemo(() => {
    const groupsMap = new Map()

    exercises.forEach(userExercise => {
      if (userExercise.exercise?.group) {
        const group = userExercise.exercise.group
        if (!groupsMap.has(group.id)) {
          groupsMap.set(group.id, {
            id: group.id,
            name: group.name,
            image_url: group.image_url,
            body_section: group.body_section,
            fir_level: group.fir_level,
            body_section_name: group.body_section_name,
            fir_level_name: group.fir_level_name,
          })
        }
      }
    })

    return Array.from(groupsMap.values())
  }, [exercises])

  // Helper function to format FIR level names
  const formatFirLevel = (levelName: string | null): string => {
    if (!levelName) return 'Unknown'
    return `FIR: ${capitalizeFirstLetter(levelName)}`
  }

  // Create categories for each group
  const getGroupCategories = (group: any): string[] => {
    const categories: string[] = []

    if (group.body_section_name) {
      categories.push(capitalizeFirstLetter(group.body_section_name))
    }

    if (group.fir_level_name) {
      categories.push(formatFirLevel(group.fir_level_name))
    }

    return categories
  }

  if (!dayId || isNaN(dayId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid day</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Feature image with back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/strengthen">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 overflow-hidden">
          {loading ? (
            <ImageLoading />
          ) : error ? (
            <ImageError message={error} />
          ) : !imageUrl ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={imageUrl}
              alt={`Day ${dayId} workout`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          )}
        </div>
      </div>

      <div className="px-4">
        <h1 className="text-2xl font-bold">Day {dayId} workout</h1>
        <CollapsibleBox title="Exercises" defaultOpen={false}>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Below is a list of exercise which altogether will work the muscles highlighted above
              for Day {dayId}. Click on the 'Exercise picture' to see full technique video. Click on
              the 'Muscle picture' to view exercise alternatives. Write in 'Notes' any info
              important to you (e.g. Technique reminders, reps/sets/weight).
            </p>
          </div>
        </CollapsibleBox>

        {/* Single row layout for exercises and groups */}
        <div className="mt-6">
          {exercisesError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{exercisesError}</AlertDescription>
            </Alert>
          )}

          {exercisesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
              {/* Loading state for groups */}
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                    <div className="aspect-video"></div>
                    <div className="p-3">
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Loading state for exercises */}
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                    <div className="aspect-video"></div>
                    <div className="p-3">
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : exercises.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Left column: Exercise Groups */}
              <div className="grid grid-cols-1 gap-4">
                {exerciseGroups.map(group => (
                  <ExerciseCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    image={group.image_url || '/placeholder.svg?height=200&width=300'}
                    linkPrefix="/strengthen/group"
                    categories={getGroupCategories(group)}
                    showCategories={true}
                    showLabels={false}
                  />
                ))}
              </div>

              {/* Right column: Exercises */}
              <div className="grid grid-cols-1 gap-4">
                {exercises.map(userExercise => {
                  if (!userExercise.exercise) return null

                  return (
                    <ExerciseCard
                      key={userExercise.id}
                      id={userExercise.exercise.id}
                      name={userExercise.exercise.name}
                      image={
                        userExercise.exercise.image_url || '/placeholder.svg?height=200&width=300'
                      }
                      linkPrefix="/strengthen"
                      reps={userExercise.exercise.reps?.toString()}
                      showLabels={true}
                      showCategories={false}
                    />
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No exercises found for Day {dayId}. Please check your workout assignment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
