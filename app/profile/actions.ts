"use server"

import { createClient } from "@supabase/supabase-js"

// Create a server-side Supabase client with hardcoded URL
function createServerClient() {
  const supabaseUrl = "https://nadfduujsmcwckcdsmlb.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: true,
    },
  })
}

export async function getUserWorkouts(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("workout_days")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching user workouts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserWorkouts:", error)
    return []
  }
}

export async function toggleWorkoutDay(userId: string, date: string, completed: boolean) {
  try {
    const supabase = createServerClient()

    // Check if the workout day already exists
    const { data: existingWorkout, error: fetchError } = await supabase
      .from("workout_days")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle()

    if (fetchError) {
      console.error("Error checking existing workout:", fetchError)
      return { success: false }
    }

    if (existingWorkout) {
      // Update existing workout
      const { error: updateError } = await supabase
        .from("workout_days")
        .update({ completed })
        .eq("id", existingWorkout.id)

      if (updateError) {
        console.error("Error updating workout day:", updateError)
        return { success: false }
      }
    } else {
      // Insert new workout
      const { error: insertError } = await supabase.from("workout_days").insert({
        user_id: userId,
        date,
        completed,
      })

      if (insertError) {
        console.error("Error inserting workout day:", insertError)
        return { success: false }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in toggleWorkoutDay:", error)
    return { success: false }
  }
}
