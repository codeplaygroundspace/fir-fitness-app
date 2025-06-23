'use client'

import { useState, useEffect } from 'react'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseWithLabels } from '@/lib/types'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { useAuth } from '@/components/auth/auth-provider'
import { ConfigError } from '@/components/common/config-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

export default function HomePage() {
  const [cardioExercises, setCardioExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, error: authError } = useAuth()

  useEffect(() => {
    async function loadExercises() {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem('warm-up-exercises')
        const cachedTimestamp = localStorage.getItem('warm-up-exercises-timestamp')

        // If we have cached data and it's not expired
        if (cachedData && cachedTimestamp) {
          const timestamp = Number.parseInt(cachedTimestamp, 10)
          const now = Date.now()

          // Use cached data if it's less than 24 hours old
          if (now - timestamp < CACHE_EXPIRATION) {
            const exercises = JSON.parse(cachedData)
            setCardioExercises(exercises)
            setLoading(false)
            return
          }
        }

        // If no cache or expired, fetch from API
        const response = await fetch('/api/exercises?type=warm-up')

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error:', errorData)
          throw new Error(errorData.error || `Failed to fetch warmup exercises: ${response.status}`)
        }

        const exercises = await response.json()

        // Check if we got a valid response
        if (!Array.isArray(exercises)) {
          console.error('Invalid API response format:', exercises)
          throw new Error('Invalid response format from API')
        }

        setCardioExercises(exercises)

        // Save to localStorage with timestamp
        localStorage.setItem('warm-up-exercises', JSON.stringify(exercises))
        localStorage.setItem('warm-up-exercises-timestamp', Date.now().toString())
      } catch (error) {
        console.error('Error loading exercises:', error)
        setError(error instanceof Error ? error.message : 'Failed to load exercises')

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem('warm-up-exercises')
          if (cachedData) {
            setCardioExercises(JSON.parse(cachedData))
          }
        } catch (cacheError) {
          console.error('Error loading from cache:', cacheError)
        }
      } finally {
        setLoading(false)
      }
    }

    // Only load exercises if user is authenticated
    if (user) {
      loadExercises()
    }
  }, [user])

  // If there's an auth error, show the config error component
  if (authError) {
    return <ConfigError message={authError} />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading">Warm up</h1>

      <CollapsibleBox
        title="Objective: Raise your heart rate + move all of your body"
        defaultOpen={false}
      >
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Raising your Heart Rate whilst moving all your major joints and muscles is vital to
            safely prepare your body for exercise. You can do this in just 5 min by following the
            exercises below:
          </p>
        </div>
      </CollapsibleBox>

      <section>
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
        ) : cardioExercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {cardioExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/warm-up"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No warmup exercises found. Please add some exercises to get started.
              </p>
            </div>

            {/* Helper button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  // Force reload without cache
                  localStorage.removeItem('warm-up-exercises')
                  localStorage.removeItem('warm-up-exercises-timestamp')
                  window.location.reload()
                }}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
