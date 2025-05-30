'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useCache } from '@/hooks/use-cache'
import { CACHE_KEYS } from '@/lib/cache-constants'

interface BodyMuscle {
  id: number
  name: string
  body_section: number
  image_url: string
}

interface BodyMuscleContextType {
  getBodyMuscle: (id: number) => BodyMuscle | null
  isLoading: (id: number) => boolean
  error: string | null
}

// Use a plain object for caching (serializable)
type BodyMuscleCache = Record<number, BodyMuscle>

const BodyMuscleContext = createContext<BodyMuscleContextType | undefined>(undefined)

export function BodyMuscleProvider({ children }: { children: ReactNode }) {
  const [bodyMuscles, setBodyMuscles] = useState<Map<number, BodyMuscle>>(new Map())
  const [loadingMuscles, setLoadingMuscles] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const { getCachedData, setCachedData } = useCache<BodyMuscleCache>(CACHE_KEYS.BODY_MUSCLES)

  // Load cached data on mount - fix infinite loop by removing getCachedData from dependencies
  useEffect(() => {
    const cached = getCachedData()
    if (cached) {
      // Convert plain object back to Map
      const muscleMap = new Map<number, BodyMuscle>()
      Object.entries(cached).forEach(([id, muscle]) => {
        muscleMap.set(Number(id), muscle)
      })
      setBodyMuscles(muscleMap)
    }
  }, []) // Empty dependency array - only run on mount

  const fetchBodyMuscle = useCallback(
    async (id: number): Promise<BodyMuscle | null> => {
      // Check if already cached
      if (bodyMuscles.has(id)) {
        return bodyMuscles.get(id) || null
      }

      // Check if already loading
      if (loadingMuscles.has(id)) {
        return null
      }

      // Start loading
      setLoadingMuscles(prev => new Set(prev).add(id))
      setError(null)

      try {
        const response = await fetch(`/api/body-muscles/${id}`)
        if (response.ok) {
          const muscle: BodyMuscle = await response.json()

          // Update state
          setBodyMuscles(prev => {
            const newMap = new Map(prev)
            newMap.set(id, muscle)

            // Convert Map to plain object for caching
            const cacheObject: BodyMuscleCache = {}
            newMap.forEach((value, key) => {
              cacheObject[key] = value
            })
            setCachedData(cacheObject)

            return newMap
          })

          return muscle
        } else {
          throw new Error(`Failed to fetch muscle ${id}: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching body muscle:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch body muscle')
        return null
      } finally {
        setLoadingMuscles(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    },
    [bodyMuscles, loadingMuscles, setCachedData]
  )

  const getBodyMuscle = useCallback(
    (id: number): BodyMuscle | null => {
      const muscle = bodyMuscles.get(id)
      if (!muscle && !loadingMuscles.has(id)) {
        // Trigger fetch if not cached and not loading
        fetchBodyMuscle(id)
      }
      return muscle || null
    },
    [bodyMuscles, loadingMuscles, fetchBodyMuscle]
  )

  const isLoading = useCallback(
    (id: number): boolean => {
      return loadingMuscles.has(id)
    },
    [loadingMuscles]
  )

  return (
    <BodyMuscleContext.Provider value={{ getBodyMuscle, isLoading, error }}>
      {children}
    </BodyMuscleContext.Provider>
  )
}

export function useBodyMuscle() {
  const context = useContext(BodyMuscleContext)
  if (context === undefined) {
    throw new Error('useBodyMuscle must be used within a BodyMuscleProvider')
  }
  return context
}
