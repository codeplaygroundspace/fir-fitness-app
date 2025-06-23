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
    exercise_group: number | null
    kit?: number | null
    body_muscle?: number | null
    kit_info?: {
      id: number
      name: string
    } | null
    muscle_info?: {
      id: number
      name: string
      body_section: number
      image_url: string | null
    } | null
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

// Type for the raw API response
interface ApiUserDayExercise {
  id: number
  day_id: number
  exercise_id: number
  user_id: string
  exercises: {
    id: number
    name: string
    image_url: string | null
    ex_description: string | null
    exercise_group: number | null
    kit?: number | null
    body_muscle?: number | null
    exercise_kit?: {
      id: number
      name: string
    } | null
    body_muscles?: {
      id: number
      name: string
      body_section: number
      image_url: string | null
    } | null
    exercise_groups?: {
      id: number
      name: string
      image_url: string
      body_sec: number
      fir_level: number | null
      exercise_body_section?: {
        name: string
      } | null
      exercise_fir?: {
        name: string
      } | null
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

        const apiData: ApiUserDayExercise[] = await response.json()

        // Validate the data
        if (!Array.isArray(apiData)) {
          console.error('Invalid API response format:', apiData)
          throw new Error('Invalid response format from API')
        }

        // Transform API response to match expected interface
        const transformedData: UserDayExercise[] = apiData.map(item => ({
          id: item.id,
          day_id: item.day_id,
          exercise_id: item.exercise_id,
          user_id: item.user_id,
          exercise: item.exercises
            ? {
                id: item.exercises.id,
                name: item.exercises.name,
                image_url: item.exercises.image_url,
                description: item.exercises.ex_description,
                exercise_group: item.exercises.exercise_group,
                kit: item.exercises.kit,
                body_muscle: item.exercises.body_muscle,
                kit_info: item.exercises.exercise_kit,
                muscle_info: item.exercises.body_muscles,
                group: item.exercises.exercise_groups
                  ? {
                      id: item.exercises.exercise_groups.id,
                      name: item.exercises.exercise_groups.name,
                      image_url: item.exercises.exercise_groups.image_url,
                      body_section: item.exercises.exercise_groups.body_sec,
                      fir_level: item.exercises.exercise_groups.fir_level,
                      body_section_name:
                        item.exercises.exercise_groups.exercise_body_section?.name || null,
                      fir_level_name: item.exercises.exercise_groups.exercise_fir?.name || null,
                    }
                  : null,
              }
            : null,
        }))

        if (!mounted) return

        setExercises(transformedData)
        setCachedData(transformedData)
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
