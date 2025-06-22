'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Image from 'next/image'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'

interface GroupData {
  id: number
  name: string
  image_url?: string
  body_section?: string
  fir_level?: string
}

export default function ExerciseGroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = Number(params.id)

  const [exercises, setExercises] = useState<ExerciseWithLabels[]>([])
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load group data and exercises when component mounts or groupId changes
  useEffect(() => {
    async function loadGroupData() {
      try {
        setLoading(true)
        setImageLoading(true)

        if (isNaN(groupId)) {
          setError('Invalid group ID')
          return
        }

        // Fetch group data
        const groupResponse = await fetch(`/api/groups/${groupId}`)
        if (groupResponse.ok) {
          const group = await groupResponse.json()
          setGroupData(group)
        } else {
          console.error('Failed to fetch group data')
          setGroupData({ id: groupId, name: `Exercise Group ${groupId}` })
        }

        // Fetch exercises for this group
        const exercisesResponse = await fetch(`/api/exercises?group=${groupId}`)

        if (!exercisesResponse.ok) {
          const errorData = await exercisesResponse.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Failed to load exercises: ${exercisesResponse.status}`
          )
        }

        const groupExercises = await exercisesResponse.json()
        setExercises(groupExercises)
      } catch (error) {
        console.error(`Error loading data for group ${groupId}:`, error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setLoading(false)
        setImageLoading(false)
      }
    }

    if (groupId) {
      loadGroupData()
    }
  }, [groupId])

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Header image with back button */}
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
          {imageLoading ? (
            <ImageLoading />
          ) : imageError ? (
            <ImageError message={imageError} />
          ) : !groupData?.image_url ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={groupData.image_url}
              alt={groupData.name || `Group ${groupId}`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
              onError={() => setImageError('Failed to load image')}
            />
          )}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {capitalizeFirstLetter(groupData?.name || `Exercise Group ${groupId}`)}
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                <div className="aspect-video"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/strengthen"
                duration={exercise.duration}
                reps={exercise.reps}
                categories={exercise.categories}
                showLabels={true}
                showCategories={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Alert className="max-w-md mx-auto">
              <AlertTitle>No exercises found</AlertTitle>
              <AlertDescription>
                There are no exercises assigned to this group yet.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                There are currently no exercises available in this group to set their
                "exercise_group" value to "{groupId}".
              </p>
              <Button onClick={() => router.push('/strengthen')} variant="outline">
                Return to Strengthen page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
