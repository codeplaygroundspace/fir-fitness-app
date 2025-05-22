import { CACHE_DURATION } from '@/lib/cache-constants'

interface CacheEntry<T> {
  data: T
  timestamp: number
  userId?: string
}

export function useCache<T>(key: string) {
  const getCachedData = (userId?: string): T | null => {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const entry: CacheEntry<T> = JSON.parse(cached)
      const now = Date.now()

      if ((!userId || entry.userId === userId) && now - entry.timestamp < CACHE_DURATION) {
        return entry.data
      }
      return null
    } catch {
      return null
    }
  }

  const setCachedData = (data: T, userId?: string) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        userId,
      }
      localStorage.setItem(key, JSON.stringify(entry))
    } catch {
      // Ignore cache errors
    }
  }

  const clearCache = () => {
    localStorage.removeItem(key)
  }

  return { getCachedData, setCachedData, clearCache }
}
