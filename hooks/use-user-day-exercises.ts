import { useState, useEffect } from 'react'
import { useCache } from './use-cache'
import { CACHE_KEYS } from '@/lib/cache-constants'

export interface UserDayExercise {
  id: number
  day_id: number
  exercise_id: number
  user_id: string
  exercise: {
    id: number
    name: string
    image_url: string | null
    description: string | null
    reps: number | null
    exercise_group: number | null
    group: {
      id: number
      name: string
      image_url: string
      body_section: number
      fir_level: number | null
      body_section_name: string | null
      fir_level_name: string | null
    } | null
  } | null
}

export const useUserDayExercises = (userId: string | undefined, dayId: number) => {
  const [exercises, setExercises] = useState<UserDayExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create a unique cache key for this user and day combination
  const cacheKey = `${CACHE_KEYS.USER_DAY_EXERCISES}-${userId}-${dayId}`
  const { getCachedData, setCachedData, clearCache } = useCache<UserDayExercise[]>(cacheKey)

  useEffect(() => {
    let mounted = true

    const loadUserDayExercises = async () => {
      if (!userId || !dayId) {
        setLoading(false)
        return
      }

      try {
        // Check cache first
        const cached = getCachedData()
        if (cached) {
          setExercises(cached)
          setLoading(false)
          return
        }

        // If no cache or expired, fetch from API
        const response = await fetch(`/api/user-day-exercises?userId=${userId}&dayId=${dayId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error:', errorData)
          throw new Error(
            errorData.error || `Failed to fetch user day exercises: ${response.status}`
          )
        }

        const exercisesData = await response.json()

        // Validate the data
        if (!Array.isArray(exercisesData)) {
          console.error('Invalid API response format:', exercisesData)
          throw new Error('Invalid response format from API')
        }

        if (!mounted) return

        setExercises(exercisesData)
        setCachedData(exercisesData)
      } catch (error) {
        console.error('Error loading user day exercises:', error)

        if (!mounted) return

        setError(error instanceof Error ? error.message : 'Failed to load user day exercises')

        // If API fails, try to use cached data even if expired
        const cached = getCachedData()
        if (cached) {
          setExercises(cached)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadUserDayExercises()

    return () => {
      mounted = false
    }
  }, [userId, dayId]) // Only depend on userId and dayId

  const clearCacheAndReload = () => {
    clearCache()
    window.location.reload()
  }

  return {
    exercises,
    loading,
    error,
    clearCacheAndReload,
  }
}
