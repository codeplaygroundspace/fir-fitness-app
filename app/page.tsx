"use client"

import { useState, useEffect } from "react"
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
// Update imports for moved components
import { ExerciseCard } from "@/components/exercises/exercise-card"
import { DurationLabel } from "@/components/exercises/duration-label"
import { getWarmupExercises, type ExerciseWithLabels } from "./actions"
import { Info } from "@/components/common/info"
import { useAuth } from "@/components/auth/auth-provider"
import { ConfigError } from "@/components/common/config-error"

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

export default function HomePage() {
  const [cardioExercises, setCardioExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [isSingleColumn, setIsSingleColumn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, error: authError } = useAuth()

  useEffect(() => {
    async function loadExercises() {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem("warmup-exercises")
        const cachedTimestamp = localStorage.getItem("warmup-exercises-timestamp")

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
        const exercises = await getWarmupExercises()
        setCardioExercises(exercises)

        // Save to localStorage with timestamp
        localStorage.setItem("warmup-exercises", JSON.stringify(exercises))
        localStorage.setItem("warmup-exercises-timestamp", Date.now().toString())
      } catch (error) {
        console.error("Error loading exercises:", error)
        setError(error instanceof Error ? error.message : "Failed to load exercises")

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem("warmup-exercises")
          if (cachedData) {
            setCardioExercises(JSON.parse(cachedData))
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError)
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

  const shuffleExercises = () => {
    setCardioExercises((prevExercises) => {
      // Create a copy of the array
      const shuffled = [...prevExercises]

      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      return shuffled
    })
  }

  const toggleLayout = () => {
    setIsSingleColumn(!isSingleColumn)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading">Warmup</h1>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">Error: {error}</div>}

      <Info>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base">HR Rise (always do first)</h3>
          <DurationLabel duration="2 min" />
        </div>
      </Info>

      <section>
        <div className="flex items-center mb-4 justify-end">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleLayout} className="flex items-center gap-1">
              {isSingleColumn ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
              {isSingleColumn ? "Grid" : "List"}
            </Button>
            <Button variant="outline" size="sm" onClick={shuffleExercises} className="flex items-center gap-1">
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {[1, 2, 3, 4].map((i) => (
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
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {cardioExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/warmup"
                duration={`${exercise.duration} sec`}
                reps={exercise.reps}
                showLabels={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No warmup exercises found. Please add some exercises to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
