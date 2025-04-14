import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const groupId = params.id
    console.log(`Fetching exercises for group ID: ${groupId}`)

    // First, get the group details to know what we're looking for
    const { data: group, error: groupError } = await supabaseServer
      .from("exercise_groups")
      .select("*")
      .eq("id", groupId)
      .single()

    if (groupError || !group) {
      console.error(`Error fetching group ${groupId}:`, groupError)
      return NextResponse.json([])
    }

    // Primary approach: Use the exercise_group column
    const { data: exercisesByGroup, error: groupError2 } = await supabaseServer
      .from("exercises")
      .select("*")
      .eq("exercise_group", groupId)

    if (!groupError2 && exercisesByGroup && exercisesByGroup.length > 0) {
      console.log(`Found ${exercisesByGroup.length} exercises with exercise_group=${groupId}`)

      // Map to the expected format
      const formattedExercises = exercisesByGroup.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
      }))

      return NextResponse.json(formattedExercises)
    }

    // If no exercises found with the exact exercise_group, return an empty array
    console.log(`No exercises found with exercise_group=${groupId}`)
    return NextResponse.json([])
  } catch (error) {
    console.error(`Error in getExercisesByGroup for ${params.id}:`, error)
    return NextResponse.json([])
  }
}
