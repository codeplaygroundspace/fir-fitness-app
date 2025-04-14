/**
 * Safely store data in localStorage with error handling
 */
export function setLocalStorage<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error)
    return false
  }
}

/**
 * Safely retrieve data from localStorage with error handling and type casting
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return defaultValue
  }
}

/**
 * Check if cached data is still valid based on timestamp
 */
export function isCacheValid(timestampKey: string, expirationMs: number = 24 * 60 * 60 * 1000): boolean {
  try {
    const timestamp = localStorage.getItem(timestampKey)
    if (!timestamp) return false

    const cachedTime = Number.parseInt(timestamp, 10)
    const now = Date.now()

    return now - cachedTime < expirationMs
  } catch (error) {
    console.error(`Error checking cache validity for ${timestampKey}:`, error)
    return false
  }
}

/**
 * Store data with timestamp
 */
export function setCachedData<T>(key: string, data: T): void {
  setLocalStorage(key, data)
  setLocalStorage(`${key}-timestamp`, Date.now())
}

/**
 * Get cached data if valid, otherwise return null
 */
export function getCachedData<T>(key: string, expirationMs: number = 24 * 60 * 60 * 1000): T | null {
  if (isCacheValid(`${key}-timestamp`, expirationMs)) {
    return getLocalStorage<T | null>(key, null)
  }
  return null
}
