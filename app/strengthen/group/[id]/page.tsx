'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseWithLabels } from '@/lib/types'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { ViewControls } from '@/components/controls/view-controls'

export default function ExerciseGroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = Number(params.id)

  const [exercises, setExercises] = useState<ExerciseWithLabels[]>([])
  const [groupName, setGroupName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSingleColumn, setIsSingleColumn] = useState(false)

  // Load exercises when component mounts or groupId changes
  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true)

        if (isNaN(groupId)) {
          setError('Invalid group ID')
          return
        }

        // Use the new unified API endpoint
        const response = await fetch(`/api/exercises?group=${groupId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to load exercises: ${response.status}`)
        }

        const groupExercises = await response.json()

        // Get the group name from the URL path
        const pathSegments = window.location.pathname.split('/')
        const groupIdFromPath = pathSegments[pathSegments.length - 1]

        // Fetch the group name from the server or use a default
        if (groupIdFromPath) {
          try {
            const response = await fetch(`/api/groups/${groupIdFromPath}`)
            if (response.ok) {
              const data = await response.json()
              setGroupName(data.name || `Exercise Group ${groupId}`)
            } else {
              // If API fails, use a default name based on the URL
              const nameFromUrl = decodeURIComponent(groupIdFromPath)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
              setGroupName(nameFromUrl)
            }
          } catch (error) {
            console.error('Error fetching group name:', error)
            setGroupName(`Exercise Group ${groupId}`)
          }
        } else {
          setGroupName(`Exercise Group ${groupId}`)
        }

        setExercises(groupExercises)
      } catch (error) {
        console.error(`Error loading exercises for group ${groupId}:`, error)
        setError(error instanceof Error ? error.message : 'Failed to load exercises')
      } finally {
        setLoading(false)
      }
    }

    if (groupId) {
      loadExercises()
    }
  }, [groupId])

  // Toggle between grid and list view
  const toggleLayout = () => {
    setIsSingleColumn(!isSingleColumn)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/strengthen" className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-2xl font-bold leading-none">{capitalizeFirstLetter(groupName)}</span>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end items-center mb-4">
        <ViewControls isSingleColumn={isSingleColumn} onToggleLayout={toggleLayout} />
      </div>

      {loading ? (
        <div className={`grid ${isSingleColumn ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
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
        <div className={`grid ${isSingleColumn ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
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
              showCategories={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Alert className="max-w-md mx-auto">
            <AlertTitle>No exercises found</AlertTitle>
            <AlertDescription>There are no exercises assigned to this group yet.</AlertDescription>
          </Alert>
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              There are currently no exercises available in this group to set their "exercise_group"
              value to "{groupId}".
            </p>
            <Button onClick={() => router.push('/strengthen')} variant="outline">
              Return to Strengthen page
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
