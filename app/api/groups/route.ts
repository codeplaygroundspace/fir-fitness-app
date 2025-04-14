import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: groups, error } = await supabaseServer.from("exercise_groups").select("*").order("name")

    if (error || !groups) {
      console.error("Error fetching exercise groups:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(groups)
  } catch (error) {
    console.error("Error in getExerciseGroups:", error)
    return NextResponse.json([])
  }
}
