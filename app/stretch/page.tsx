"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExerciseCard } from "@/components/exercises/exercise-card"
import { getStretchExercises, type ExerciseWithLabels } from "../actions"

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

export default function StretchPage() {
  const [stretchExercises, setStretchExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [isSingleColumn, setIsSingleColumn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExercises() {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem("stretch-exercises")
        const cachedTimestamp = localStorage.getItem("stretch-exercises-timestamp")

        // If we have cached data and it's not expired
        if (cachedData && cachedTimestamp) {
          const timestamp = Number.parseInt(cachedTimestamp, 10)
          const now = Date.now()

          // Use cached data if it's less than 24 hours old
          if (now - timestamp < CACHE_EXPIRATION) {
            const exercises = JSON.parse(cachedData)
            setStretchExercises(exercises)
            setLoading(false)
            return
          }
        }

        // If no cache or expired, fetch from API
        const exercises = await getStretchExercises()

        // Validate the data
        if (!Array.isArray(exercises)) {
          throw new Error("Invalid response format: expected an array")
        }

        // Ensure each exercise has a valid image property
        const validatedExercises = exercises.map((exercise) => ({
          ...exercise,
          image: exercise.image || "/placeholder.svg?height=200&width=300",
        }))

        console.log("Stretch exercises loaded:", validatedExercises)
        setStretchExercises(validatedExercises)

        // Save to localStorage with timestamp
        localStorage.setItem("stretch-exercises", JSON.stringify(validatedExercises))
        localStorage.setItem("stretch-exercises-timestamp", Date.now().toString())
      } catch (error) {
        console.error("Error loading exercises:", error)
        setError(error instanceof Error ? error.message : "Failed to load exercises")

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem("stretch-exercises")
          if (cachedData) {
            setStretchExercises(JSON.parse(cachedData))
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  const shuffleExercises = () => {
    setStretchExercises((prevExercises) => {
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
      <h1>Stretch</h1>

      <section>
        <div className="flex justify-end items-center mb-4">
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

        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">Error: {error}</div>}

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
        ) : stretchExercises.length > 0 ? (
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {stretchExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/stretch"
                showLabels={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No stretch exercises found. Please add some exercises to get started.
            </p>
          </div>
        )}
      </section>

      {/* New section with just an image - updated to show full height */}
      <section className="mt-12 mb-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="flex justify-center">
            <Image
              src="https://live.staticflickr.com/65535/54398757288_bca1273e3a_w.jpg"
              alt="Yoga stretching pose"
              width={400}
              height={600}
              className="w-auto h-auto max-h-[500px] object-contain"
              priority
            />
          </div>
          <div className="bg-card p-4 text-center">
            <h2 className="text-xl font-semibold">Improve Your Flexibility</h2>
            <p className="text-muted-foreground">
              Regular stretching helps increase your range of motion and reduces risk of injury
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
