import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserTrainingDays } from '@/app/strengthen/actions'
import { useCache } from './use-cache'
import { CACHE_KEYS } from '@/lib/cache-constants'

export const useTrainingDays = (category: 'strengthen' | 'recover' = 'strengthen') => {
  const { user } = useAuth()
  const cacheKey = category === 'recover' ? CACHE_KEYS.RECOVER_DAYS : CACHE_KEYS.TRAINING_DAYS
  const { getCachedData, setCachedData } = useCache<number[]>(cacheKey)
  const [days, setDays] = useState<number[]>(() => (user ? getCachedData(user.id) || [] : []))
  const [loading, setLoading] = useState(!days.length)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0
    let mounted = true

    const fetchTrainingDays = async () => {
      if (!user) {
        setError('Please sign in to view your training days')
        setLoading(false)
        return
      }

      // Check cache first
      const cached = getCachedData(user.id)
      if (cached) {
        setDays(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const trainingDays = await getUserTrainingDays(user.id, category)

        if (!mounted) return

        setCachedData(trainingDays, user.id)
        setDays(trainingDays)
      } catch (err) {
        console.error('Error fetching training days:', err)

        if (!mounted) return

        if (retryCount < 3) {
          retryCount++
          setTimeout(fetchTrainingDays, 1000 * retryCount)
        } else {
          setError('Failed to load training days')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchTrainingDays()

    return () => {
      mounted = false
    }
  }, [user, category])

  return { days, loading, error }
}
