import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserTrainingDays } from '@/app/strengthen/actions'

const CACHE_KEY = 'training-days-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface CacheEntry {
  days: number[]
  timestamp: number
  userId: string
}

const getCachedDays = (userId: string): number[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    const now = Date.now()

    if (entry.userId === userId && now - entry.timestamp < CACHE_DURATION) {
      return entry.days
    }
    return null
  } catch {
    return null
  }
}

const setCachedDays = (userId: string, days: number[]) => {
  try {
    const entry: CacheEntry = {
      days,
      timestamp: Date.now(),
      userId,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Ignore cache errors
  }
}

export const useTrainingDays = () => {
  const { user } = useAuth()
  const [days, setDays] = useState<number[]>(() => (user ? getCachedDays(user.id) || [] : []))
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
      const cached = getCachedDays(user.id)
      if (cached) {
        setDays(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const trainingDays = await getUserTrainingDays(user.id)

        if (!mounted) return

        setCachedDays(user.id, trainingDays)
        setDays(trainingDays)
      } catch (err) {
        console.error('Error fetching training days:', err)

        if (!mounted) return

        if (retryCount < MAX_RETRIES) {
          retryCount++
          setTimeout(fetchTrainingDays, RETRY_DELAY * retryCount)
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
  }, [user])

  return { days, loading, error }
}
