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
import { Card, CardContent } from '@/components/ui/card'
import { capitalizeFirstLetter } from '@/lib/text-utils'

export default function RecoverDayPage() {
  const params = useParams()
  const router = useRouter()
  const dayId = Number(params.id)
  const { user } = useAuth()
  const { days, loading: daysLoading } = useTrainingDays('recover')
  const { imageUrl, loading, error } = useDayImage(user?.id, dayId, 'recover')
  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
  } = useUserDayExercises(user?.id, dayId, 'recover')

  // Verify user has access to this day
  useEffect(() => {
    if (!daysLoading && dayId && !days.includes(dayId)) {
      router.push('/recover')
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
            body_section_name: group.body_section_name,
          })
        }
      }
    })

    return Array.from(groupsMap.values())
  }, [exercises])

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
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
              alt={`Day ${dayId} recovery`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          )}
        </div>
      </div>

      <div className="px-4">
        <h1 className="text-2xl font-bold">Day {dayId} Recovery</h1>
        <CollapsibleBox title="Recovery Instructions" defaultOpen={false}>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Below are stretches designed to help your muscles recover from Day {dayId} of your strengthen workout.
              Focus on the muscles you worked, holding each stretch for the recommended duration.
              Click on the 'Exercise picture' to see full technique. Click on the 'Muscle picture' to view alternative stretches.
            </p>
          </div>
        </CollapsibleBox>

        <div className="mt-6">
          {exercisesError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{exercisesError}</AlertDescription>
            </Alert>
          )}

          {exercisesLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                  <div className="aspect-video bg-muted-foreground/20"></div>
                  <div className="p-3">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : exercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {exercises.map((userExercise, index) => {
                if (!userExercise.exercise) return null

                // Find the corresponding group for this exercise
                const exerciseGroup = exerciseGroups.find(
                  group => group.id === userExercise.exercise?.group?.id
                )

                const formattedName = capitalizeFirstLetter(userExercise.exercise.name)

                return (
                  <div key={userExercise.id}>
                    {/* Exercise card with thumbnail overlay */}
                    <Card className="h-full">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        {/* Main exercise image - clickable area */}
                        <Link
                          href={`/recover/${userExercise.exercise.id}`}
                          className="block w-full h-full relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
                          aria-labelledby={`exercise-title-${userExercise.exercise.id}`}
                        >
                          <Image
                            src={
                              userExercise.exercise.image_url ||
                              '/placeholder.svg?height=400&width=600'
                            }
                            alt={`Image showing ${formattedName} stretch`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized={
                              userExercise.exercise.image_url
                                ? !userExercise.exercise.image_url.startsWith('/')
                                : false
                            }
                          />
                        </Link>

                        {/* Muscle group thumbnail in top-left corner - separate clickable area */}
                        {exerciseGroup && exerciseGroup.image_url && (
                          <div className="absolute top-2 left-2 size-24 rounded-md overflow-hidden border-2 border-white shadow-lg bg-white z-10">
                            <Link
                              href={`/recover/group/${exerciseGroup.id}`}
                              className="block w-full h-full relative hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              <Image
                                src={exerciseGroup.image_url}
                                alt={exerciseGroup.name}
                                fill
                                className="object-cover"
                                sizes="160px"
                                unoptimized={!exerciseGroup.image_url.startsWith('/')}
                              />
                            </Link>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3">
                        <Link
                          href={`/recover/${userExercise.exercise.id}`}
                          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
                        >
                          <h2
                            id={`exercise-title-${userExercise.exercise.id}`}
                            className="font-heading font-medium text-xl mb-2 text-card-foreground hover:text-primary transition-colors"
                          >
                            {formattedName}
                          </h2>
                        </Link>

                        {/* Exercise description */}
                        {userExercise.exercise.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {userExercise.exercise.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No recovery exercises found for Day {dayId}. Please check your recovery assignment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}