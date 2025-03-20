"use client"

import { useState, useEffect } from "react"
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExerciseCard } from "@/components/exercise-card"
import { getStretchExercises, type ExerciseWithLabels } from "../actions"

export default function StretchPage() {
  const [stretchExercises, setStretchExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [isSingleColumn, setIsSingleColumn] = useState(false)

  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await getStretchExercises()
        setStretchExercises(exercises)
      } catch (error) {
        console.error("Error loading exercises:", error)
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
      <h1 className="text-2xl font-bold mb-6">Stretch</h1>

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
    </div>
  )
}

