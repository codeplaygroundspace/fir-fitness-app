"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getUserWorkouts, toggleWorkoutDay as toggleWorkoutDayAction } from "@/app/profile/actions"
import { createWorkoutClient, createMockWorkoutClient } from "./supabase-client"
import type { WorkoutDay, WorkoutContextType } from "@/lib/types"

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const { user } = useAuth()

  // Initialize Supabase client
  useEffect(() => {
    try {
      // Only initialize in the browser
      if (typeof window !== "undefined") {
        const client = createWorkoutClient()
        setSupabase(client)
      }
    } catch (err) {
      console.error("Failed to initialize Supabase client for workout context:", err)
      setError(err instanceof Error ? err.message : "Failed to initialize Supabase client")
      // Set a mock client so the app doesn't crash
      setSupabase(createMockWorkoutClient())
      setIsLoading(false)
    }
  }, [])

  // Load workout data from Supabase on component mount
  useEffect(() => {
    if (!user || !supabase) {
      setIsLoading(false)
      return
    }

    async function loadWorkouts() {
      try {
        const workouts = await getUserWorkouts(user.id)
        setWorkoutDays(workouts)
      } catch (error) {
        console.error("Error loading workouts:", error)
        setError(error instanceof Error ? error.message : "Failed to load workouts")
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkouts()

    // Set up real-time subscription for workout changes
    try {
      const channel = supabase
        .channel("workout_days_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "workout_days",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Workout days changed:", payload)
            // Refresh workouts when changes occur
            getUserWorkouts(user.id).then((workouts) => {
              setWorkoutDays(workouts)
            })
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error("Error setting up real-time subscription:", error)
      return () => {}
    }
  }, [user, supabase])

  // Toggle workout completion for a day
  const toggleWorkoutDay = async (date: string) => {
    if (!user) return

    const existingWorkout = workoutDays.find((day) => day.date === date)
    const newCompleted = existingWorkout ? !existingWorkout.completed : true

    // Optimistically update UI
    setWorkoutDays((prev) => {
      if (existingWorkout) {
        return prev.map((day) => (day.date === date ? { ...day, completed: newCompleted } : day))
      } else {
        return [...prev, { user_id: user.id, date, completed: newCompleted }]
      }
    })

    // Update in Supabase
    try {
      const result = await toggleWorkoutDayAction(user.id, date, newCompleted)

      if (!result.success) {
        // Revert optimistic update if server update fails
        setWorkoutDays((prev) => {
          if (existingWorkout) {
            return prev.map((day) => (day.date === date ? { ...day, completed: existingWorkout.completed } : day))
          } else {
            return prev.filter((day) => day.date !== date)
          }
        })
      }
    } catch (error) {
      console.error("Error toggling workout day:", error)
      // Revert optimistic update on error
      setWorkoutDays((prev) => {
        if (existingWorkout) {
          return prev.map((day) => (day.date === date ? { ...day, completed: existingWorkout.completed } : day))
        } else {
          return prev.filter((day) => day.date !== date)
        }
      })
    }
  }

  // Check if a date has a completed workout
  const isWorkoutCompleted = (date: string): boolean => {
    const workout = workoutDays.find((day) => day.date === date)
    return workout?.completed || false
  }

  return (
    <WorkoutContext.Provider value={{ workoutDays, toggleWorkoutDay, isWorkoutCompleted, isLoading, error }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider")
  }
  return context
}

