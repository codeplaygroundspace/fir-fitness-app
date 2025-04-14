import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // First, get the warmup category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%warmup%")

    if (categoryError || !categoryData || categoryData.length === 0) {
      console.error("Error or no warmup category found:", categoryError)
      return NextResponse.json([])
    }

    // Use the first category that matches
    const warmupCategoryId = categoryData[0].id

    // Now get all exercises in the warmup category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from("exercises")
      .select("*")
      .eq("category_id", warmupCategoryId)

    if (exercisesError || !exercises) {
      console.error("Error fetching warmup exercises:", exercisesError)
      return NextResponse.json([])
    }

    // Map exercises to the format we need
    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || "30",
      reps: exercise.reps || "4",
      labels: [],
    }))

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error("Error in getWarmupExercises:", error)
    return NextResponse.json([])
  }
}
