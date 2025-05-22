import { useState, useEffect } from 'react'
import { getDayImage } from '@/app/strengthen/actions'

const CACHE_KEY = 'day-image-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface CacheEntry {
  url: string | null
  timestamp: number
  userId: string
  dayId: number
}

const getCachedDayImage = (userId: string, dayId: number): string | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    const now = Date.now()

    if (
      entry.userId === userId &&
      entry.dayId === dayId &&
      now - entry.timestamp < CACHE_DURATION
    ) {
      return entry.url
    }
    return null
  } catch {
    return null
  }
}

const setCachedDayImage = (userId: string, dayId: number, url: string | null) => {
  try {
    const entry: CacheEntry = {
      url,
      timestamp: Date.now(),
      userId,
      dayId,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Ignore cache errors
  }
}

export const useDayImage = (userId: string | undefined, dayId: number | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(() =>
    userId && dayId ? getCachedDayImage(userId, dayId) : null
  )
  const [loading, setLoading] = useState(!imageUrl)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0
    let mounted = true

    const fetchDayImage = async () => {
      if (!userId || !dayId) {
        setError('Invalid user or day')
        setLoading(false)
        return
      }

      // Check cache first
      const cached = getCachedDayImage(userId, dayId)
      if (cached) {
        setImageUrl(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const dayImageUrl = await getDayImage(dayId, userId)

        if (!mounted) return

        setCachedDayImage(userId, dayId, dayImageUrl)
        setImageUrl(dayImageUrl)
      } catch (err) {
        console.error('Error fetching day image:', err)

        if (!mounted) return

        if (retryCount < MAX_RETRIES) {
          retryCount++
          setTimeout(fetchDayImage, RETRY_DELAY * retryCount)
        } else {
          setError('Failed to load day image')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDayImage()

    return () => {
      mounted = false
    }
  }, [userId, dayId])

  return { imageUrl, loading, error }
}
