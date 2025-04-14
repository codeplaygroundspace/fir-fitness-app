import { getSupabaseBrowser } from "@/lib/supabase"
import { getLocalStorage, setLocalStorage } from "@/lib/storage-utils"
import type { OfflineWorkoutLog } from "@/lib/types"

// Constants
const OFFLINE_LOGS_KEY = "offline-workout-logs"

// Save workout log (works online or offline)
export async function saveWorkoutLog(log: Omit<OfflineWorkoutLog, "synced">) {
  try {
    // Check if online
    if (navigator.onLine) {
      const supabase = getSupabaseBrowser()
      const { data: session } = await supabase.auth.getSession()

      if (session.session) {
        // We're online and authenticated, save directly to Supabase
        const { error } = await supabase.from("workout_logs").insert({
          user_id: session.session.user.id,
          ...log,
        })

        if (error) throw error
        return { success: true }
      }
    }

    // If we're offline or not authenticated, save locally
    const offlineLogs = getLocalStorage<OfflineWorkoutLog[]>(OFFLINE_LOGS_KEY, [])
    offlineLogs.push({ ...log, synced: false })
    setLocalStorage(OFFLINE_LOGS_KEY, offlineLogs)

    return { success: true, offline: true }
  } catch (error) {
    console.error("Error saving workout log:", error)

    // Save locally as fallback
    const offlineLogs = getLocalStorage<OfflineWorkoutLog[]>(OFFLINE_LOGS_KEY, [])
    offlineLogs.push({ ...log, synced: false })
    setLocalStorage(OFFLINE_LOGS_KEY, offlineLogs)

    return { success: true, offline: true, error }
  }
}

// Sync offline logs when back online
export async function syncOfflineLogs() {
  try {
    if (!navigator.onLine) return { synced: 0 }

    const supabase = getSupabaseBrowser()
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) return { synced: 0 }

    const offlineLogs = getLocalStorage<OfflineWorkoutLog[]>(OFFLINE_LOGS_KEY, [])
    const unsynced = offlineLogs.filter((log) => !log.synced)

    if (unsynced.length === 0) return { synced: 0 }

    let syncedCount = 0

    // Process each unsynced log
    for (const log of unsynced) {
      const { error } = await supabase.from("workout_logs").insert({
        user_id: session.session.user.id,
        exercise_id: log.exercise_id,
        exercise_name: log.exercise_name,
        exercise_type: log.exercise_type,
        completed_at: log.completed_at,
      })

      if (!error) {
        // Mark as synced
        log.synced = true
        syncedCount++
      }
    }

    // Update local storage with synced status
    setLocalStorage(OFFLINE_LOGS_KEY, offlineLogs)

    // Remove fully synced logs
    const remainingLogs = offlineLogs.filter((log) => !log.synced)
    setLocalStorage(OFFLINE_LOGS_KEY, remainingLogs)

    return { synced: syncedCount }
  } catch (error) {
    console.error("Error syncing offline logs:", error)
    return { synced: 0, error }
  }
}

// Listen for online status changes to trigger sync
export function setupOfflineSync() {
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
      console.log("Back online, syncing logs...")
      syncOfflineLogs()
    })
  }
}

