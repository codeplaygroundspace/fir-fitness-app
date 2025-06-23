'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { capitalizeFirstLetter } from '@/lib/text-utils'
import { getExerciseGroups, type ExerciseGroup } from '../../actions'
import Link from 'next/link'

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

// Constants for localStorage keys to avoid typos
const LS_KEYS = {
  GROUPS: 'workout-groups',
  TIMESTAMP: 'workout-groups-timestamp',
}

export default function CreateYourOwnWorkoutPage() {
  const [exerciseGroups, setExerciseGroups] = useState<ExerciseGroup[]>([])
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExerciseGroups() {
      setIsLoading(true)
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem(LS_KEYS.GROUPS)
        const cachedTimestamp = localStorage.getItem(LS_KEYS.TIMESTAMP)

        // If we have cached data and it's not expired
        if (cachedData && cachedTimestamp) {
          const timestamp = Number.parseInt(cachedTimestamp, 10)
          const now = Date.now()

          // Use cached data if it's less than 24 hours old
          if (now - timestamp < CACHE_EXPIRATION) {
            const groups = JSON.parse(cachedData)
            setExerciseGroups(groups)
            setIsLoading(false)
            return
          }
        }

        // If no cache or expired, fetch from API
        const groups = await getExerciseGroups()

        if (!groups || groups.length === 0) {
          setError('No exercise groups found. Please check your database configuration.')
        } else {
          setExerciseGroups(groups)
          // Save to localStorage with timestamp
          localStorage.setItem(LS_KEYS.GROUPS, JSON.stringify(groups))
          localStorage.setItem(LS_KEYS.TIMESTAMP, Date.now().toString())
        }
      } catch (error) {
        console.error('Error loading exercise groups:', error)
        setError('Failed to load exercise groups. Please try again later.')

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem(LS_KEYS.GROUPS)
          if (cachedData) {
            setExerciseGroups(JSON.parse(cachedData))
          }
        } catch (cacheError) {
          console.error('Error loading from cache:', cacheError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadExerciseGroups()
  }, [])

  // No filtering needed anymore - show all exercise groups
  const filteredGroups = exerciseGroups

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/strengthen" className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <h1>Create your own workout</h1>

      <CollapsibleBox title="Functional Moves Guide" defaultOpen={false}>
        <p className="text-sm text-muted-foreground">
          Below are 8 Functional Moves, each offering multiple exercise variations. The higher your
          Functional Imbalance Risk (FIR) for each Functional Move, the more effort you should exert
          when performing that exercise:
        </p>
        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>FIR: High 🔴</strong> Maximal Relative Effort (Push yourself to the max when
            doing this exercise)
          </li>
          <li>
            <strong>FIR: Moderate 🟡</strong> Moderate Relative Effort
          </li>
          <li>
            <strong>FIR: Low 🟢</strong> Minimal Relative Effort (Don't push too hard - just
            maintain your current strength)
          </li>
        </ul>
      </CollapsibleBox>

      <section>
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
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredGroups.map(group => (
              <ExerciseCard
                key={group.id}
                id={group.id}
                name={group.name}
                image={group.image_url || '/placeholder.svg?height=200&width=300'}
                linkPrefix="/strengthen/group"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-muted-foreground">
                No Workout exercise groups found. Please add some groups to get started.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
