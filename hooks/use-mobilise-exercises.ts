import { useState, useEffect } from 'react'
import type { ExerciseWithLabels } from '@/lib/types'
import { useCache } from './use-cache'
import { CACHE_KEYS } from '@/lib/cache-constants'

export const useMobiliseExercises = () => {
  const [allExercises, setAllExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maxMuscleGroup, setMaxMuscleGroup] = useState(19) // Initial default, will be updated from data
  const { getCachedData, setCachedData, clearCache } = useCache<ExerciseWithLabels[]>(
    CACHE_KEYS.MOBILISE_EXERCISES
  )

  // Function to calculate the maximum muscle group ID from the exercises data
  const calculateMaxMuscleGroup = (exercises: ExerciseWithLabels[]) => {
    let maxId = 0

    exercises.forEach(exercise => {
      if (exercise.body_muscle !== null) {
        const muscleId = Number(exercise.body_muscle)
        if (!isNaN(muscleId) && muscleId > maxId) {
          maxId = muscleId
        }
      }

      // Also check the exercise name for muscle group numbers
      if (exercise.name) {
        const nameMatches = exercise.name.match(/[-\s(](\d+)[)\s]?$/)
        if (nameMatches && nameMatches[1]) {
          const nameId = parseInt(nameMatches[1], 10)
          if (!isNaN(nameId) && nameId > maxId) {
            maxId = nameId
          }
        }
      }
    })

    // Use either the calculated max or default to 19 if no data or too low
    setMaxMuscleGroup(Math.max(maxId, 19))
  }

  // Function to clear cache and reload the page
  const clearCacheAndReload = () => {
    clearCache()
    window.location.reload()
  }

  useEffect(() => {
    async function loadExercises() {
      try {
        // Check cache first
        const cached = getCachedData()
        if (cached) {
          setAllExercises(cached)
          calculateMaxMuscleGroup(cached)
          setLoading(false)
          return
        }

        // If no cache or expired, fetch from API
        const response = await fetch('/api/exercises?type=mobilise')

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Failed to fetch mobilise exercises: ${response.status}`
          )
        }

        const exercises = await response.json()

        // Validate the data
        if (!Array.isArray(exercises)) {
          throw new Error('Invalid response format from API')
        }

        // Ensure each exercise has a valid image property
        const validatedExercises = exercises.map(exercise => ({
          ...exercise,
          image: exercise.image || '/placeholder.svg?height=200&width=300',
        }))

        setAllExercises(validatedExercises)
        calculateMaxMuscleGroup(validatedExercises)
        setCachedData(validatedExercises)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load exercises')

        // If API fails, try to use cached data even if expired
        const cached = getCachedData()
        if (cached) {
          setAllExercises(cached)
          calculateMaxMuscleGroup(cached)
        }
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  return {
    allExercises,
    loading,
    error,
    maxMuscleGroup,
    clearCacheAndReload,
  }
}
