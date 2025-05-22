import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserImbalanceImage } from '@/app/strengthen/actions'

const CACHE_KEY = 'imbalance-image-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface CacheEntry {
  url: string | null
  timestamp: number
  userId: string
}

const getCachedImage = (userId: string): string | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    const now = Date.now()

    if (entry.userId === userId && now - entry.timestamp < CACHE_DURATION) {
      return entry.url
    }
    return null
  } catch {
    return null
  }
}

const setCachedImage = (userId: string, url: string | null) => {
  try {
    const entry: CacheEntry = {
      url,
      timestamp: Date.now(),
      userId,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Ignore cache errors
  }
}

export const useImbalanceImage = () => {
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState<string | null>(() =>
    user ? getCachedImage(user.id) : null
  )
  const [loading, setLoading] = useState(!imageUrl)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0
    let mounted = true

    const fetchImbalanceImage = async () => {
      if (!user) {
        setError('Please sign in to view your personal imbalance image')
        setLoading(false)
        return
      }

      // Check cache first
      const cached = getCachedImage(user.id)
      if (cached) {
        setImageUrl(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const imageUrl = await getUserImbalanceImage(user.id)

        if (!mounted) return

        setCachedImage(user.id, imageUrl)
        setImageUrl(imageUrl)
      } catch (err) {
        console.error('Error fetching imbalance image:', err)

        if (!mounted) return

        if (retryCount < MAX_RETRIES) {
          retryCount++
          setTimeout(fetchImbalanceImage, RETRY_DELAY * retryCount)
        } else {
          setError('Failed to load imbalance image')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchImbalanceImage()

    return () => {
      mounted = false
    }
  }, [user])

  return { imageUrl, loading, error }
}
