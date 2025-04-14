import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data: exercise, error } = await supabaseServer.from("exercises").select("*").eq("id", id).single()

    if (error || !exercise) {
      console.error("Error fetching exercise:", error)
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
    }

    // Format the exercise
    const formattedExercise = {
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
    }

    return NextResponse.json(formattedExercise)
  } catch (error) {
    console.error("Error in getExerciseById:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
