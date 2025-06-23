import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { BackButton } from '@/components/layout/back-button'

interface GroupData {
  id: number
  name: string
  image_url?: string
  body_section?: string
  fir_level?: string
}

export default async function ExerciseGroupPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Get the group ID from the URL parameters - await params
    const { id } = await params
    const groupId = Number.parseInt(id)

    if (isNaN(groupId)) {
      return notFound()
    }

    // Fetch group data and exercises in parallel
    const [groupResponse, exercisesResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/groups/${groupId}`,
        {
          cache: 'no-store',
          next: { revalidate: 3600 },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/exercises?group=${groupId}`,
        {
          cache: 'no-store',
          next: { revalidate: 3600 },
        }
      ),
    ])

    // Handle group data
    let groupData: GroupData
    if (groupResponse.ok) {
      groupData = await groupResponse.json()
    } else {
      console.error('Failed to fetch group data')
      groupData = { id: groupId, name: `Exercise Group ${groupId}` }
    }

    // Handle exercises data
    let exercises: ExerciseWithLabels[] = []
    let error: string | null = null

    if (!exercisesResponse.ok) {
      const errorData = await exercisesResponse.json().catch(() => ({}))
      error = errorData.error || `Failed to load exercises: ${exercisesResponse.status}`
      console.error(`Error loading data for group ${groupId}:`, error)
    } else {
      exercises = await exercisesResponse.json()
    }

    return (
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        {/* Header image with back button */}
        <div className="relative w-full">
          <div className="absolute top-4 left-4 z-10">
            <BackButton href="/strengthen" />
          </div>
          <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 overflow-hidden">
            {!groupData?.image_url ? (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            ) : (
              <Image
                src={groupData.image_url}
                alt={groupData.name || `Group ${groupId}`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority={true}
                unoptimized={!groupData.image_url.startsWith('/')}
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

          {exercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {exercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  id={exercise.id}
                  name={exercise.name}
                  image={exercise.image}
                  linkPrefix="/strengthen"
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
                <Button asChild variant="outline">
                  <a href="/strengthen">Return to Strengthen page</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ExerciseGroupPage:', error)
    return notFound()
  }
}
