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

interface UseDayImageReturn {
  imageUrl: string | null
  loading: boolean
  error: string | null
}

export const useDayImage = (userId: string | undefined, dayId: number): UseDayImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDayImage = async () => {
      if (!userId || !dayId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const url = await getDayImage(dayId, userId)
        setImageUrl(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load day image')
      } finally {
        setLoading(false)
      }
    }

    fetchDayImage()
  }, [userId, dayId])

  return { imageUrl, loading, error }
}
