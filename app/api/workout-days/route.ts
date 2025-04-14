import { type NextRequest, NextResponse } from "next/server"
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("workout_days")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching user workouts:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in getUserWorkouts:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { userId, date, completed } = body

    if (!userId || !date) {
      return NextResponse.json({ error: "User ID and date are required" }, { status: 400 })
    }

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
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (existingWorkout) {
      // Update existing workout
      const { error: updateError } = await supabase
        .from("workout_days")
        .update({ completed })
        .eq("id", existingWorkout.id)

      if (updateError) {
        console.error("Error updating workout day:", updateError)
        return NextResponse.json({ success: false }, { status: 500 })
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
        return NextResponse.json({ success: false }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in toggleWorkoutDay:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
