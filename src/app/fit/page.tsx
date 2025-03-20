"use client"

import { useState, useEffect, useMemo } from "react"
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "@/components/category-filter"
import { ExerciseCard } from "@/components/exercise-card"
import { getFitExercises, type ExerciseWithLabels } from "../actions"

export default function FitPage() {
  const [fitExercises, setFitExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [isSingleColumn, setIsSingleColumn] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  useEffect(() => {
    async function loadExercises() {
      setLoading(true)
      try {
        const exercises = await getFitExercises()
        console.log("Loaded FIT exercises:", exercises)
        setFitExercises(exercises)
      } catch (error) {
        console.error("Error loading exercises:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  // Extract all unique categories for the filter
  const allCategories = useMemo(() => {
    const categories = new Set<string>()

    // Add body regions
    categories.add("Upper")
    categories.add("Middle")
    categories.add("Lower")

    // Add FIR levels
    categories.add("FIR: High")
    categories.add("FIR: Moderate")
    categories.add("FIR: Low")

    // Add categories from exercises
    fitExercises.forEach((exercise) => {
      if (Array.isArray(exercise.categories)) {
        exercise.categories.forEach((category) => {
          categories.add(category)
        })
      }
    })

    return Array.from(categories)
  }, [fitExercises])

  // Filter exercises based on selected categories
  const filteredExercises = useMemo(() => {
    if (selectedFilters.length === 0) {
      return fitExercises
    }

    return fitExercises.filter((exercise) => {
      if (!Array.isArray(exercise.categories)) return false
      return selectedFilters.some((filter) => exercise.categories?.some((cat) => cat.includes(filter)))
    })
  }, [fitExercises, selectedFilters])

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters)
  }

  const shuffleExercises = () => {
    setFitExercises((prevExercises) => {
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
      <h1 className="text-2xl font-bold mb-4">FIT</h1>

      <div className="bg-muted p-4 rounded-lg mb-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Below are 8 Functional Moves, each offering multiple exercise variations. The higher your Functional Imbalance
          Risk (FIR) for each Functional Move, the more effort you should exert when performing that exercise:
        </p>
        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>FIR: High 🔴</strong> = Maximal Relative Effort (Push yourself to the max when doing this exercise)
          </li>
          <li>
            <strong>FIR: Mod</strong> = Moderate Relative Effort
          </li>
          <li>
            <strong>FIR: Low</strong> = Minimal Relative Effort (Don't push too hard - just maintain your current
            strength)
          </li>
        </ul>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter by Category</h2>
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

        <CategoryFilter categories={allCategories} onFilterChange={handleFilterChange} />

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
        ) : filteredExercises.length > 0 ? (
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/fit"
                categories={exercise.categories}
                showCategories={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FIT exercises found. Please add some exercises to get started.</p>
          </div>
        )}
      </section>
    </div>
  )
}

