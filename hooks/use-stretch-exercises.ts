import { useState, useEffect } from 'react'
import type { ExerciseWithLabels } from '@/lib/types'

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

export const useStretchExercises = () => {
  const [allExercises, setAllExercises] = useState<ExerciseWithLabels[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maxMuscleGroup, setMaxMuscleGroup] = useState(19) // Initial default, will be updated from data

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
    // Force reload without cache
    localStorage.removeItem('stretch-exercises')
    localStorage.removeItem('stretch-exercises-timestamp')
    window.location.reload()
  }

  useEffect(() => {
    async function loadExercises() {
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem('stretch-exercises')
        const cachedTimestamp = localStorage.getItem('stretch-exercises-timestamp')

        // If we have cached data and it's not expired
        if (cachedData && cachedTimestamp) {
          const timestamp = Number.parseInt(cachedTimestamp, 10)
          const now = Date.now()

          // Use cached data if it's less than 24 hours old
          if (now - timestamp < CACHE_EXPIRATION) {
            const exercises = JSON.parse(cachedData)
            setAllExercises(exercises)

            // Calculate max muscle group from the data
            calculateMaxMuscleGroup(exercises)

            setLoading(false)
            return
          }
        }

        // If no cache or expired, fetch from API
        const response = await fetch('/api/exercises?type=stretch')

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error:', errorData)
          throw new Error(
            errorData.error || `Failed to fetch stretch exercises: ${response.status}`
          )
        }

        const exercises = await response.json()

        // Validate the data
        if (!Array.isArray(exercises)) {
          console.error('Invalid API response format:', exercises)
          throw new Error('Invalid response format from API')
        }

        // Ensure each exercise has a valid image property
        const validatedExercises = exercises.map(exercise => ({
          ...exercise,
          image: exercise.image || '/placeholder.svg?height=200&width=300',
        }))

        setAllExercises(validatedExercises)

        // Calculate max muscle group from the data
        calculateMaxMuscleGroup(validatedExercises)

        // Save to localStorage with timestamp
        localStorage.setItem('stretch-exercises', JSON.stringify(validatedExercises))
        localStorage.setItem('stretch-exercises-timestamp', Date.now().toString())
      } catch (error) {
        console.error('Error loading exercises:', error)
        setError(error instanceof Error ? error.message : 'Failed to load exercises')

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem('stretch-exercises')
          if (cachedData) {
            const exercises = JSON.parse(cachedData)
            setAllExercises(exercises)

            // Calculate max muscle group from the data
            calculateMaxMuscleGroup(exercises)
          }
        } catch (cacheError) {
          console.error('Error loading from cache:', cacheError)
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
