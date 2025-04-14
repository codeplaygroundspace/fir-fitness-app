import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // First, get the stretch category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%stretch%")

    if (categoryError || !categoryData || categoryData.length === 0) {
      console.error("Error or no stretch category found:", categoryError)
      return NextResponse.json([])
    }

    // Use the first category that matches
    const stretchCategoryId = categoryData[0].id

    // Now get all exercises in the stretch category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from("exercises")
      .select("*")
      .eq("category_id", stretchCategoryId)

    if (exercisesError || !exercises) {
      console.error("Error fetching stretch exercises:", exercisesError)
      return NextResponse.json([])
    }

    // Map exercises to the format we need
    const formattedExercises = exercises.map((exercise) => {
      // Ensure image_url is properly handled
      let imageUrl = "/placeholder.svg?height=200&width=300"

      if (exercise.image_url) {
        // If it's a valid URL or path, use it
        if (exercise.image_url.startsWith("http") || exercise.image_url.startsWith("/")) {
          imageUrl = exercise.image_url
        }
      }

      return {
        id: exercise.id,
        name: exercise.name,
        image: imageUrl,
        description: exercise.ex_description,
        duration: exercise.duration || "15-30", // Default duration for stretches
        reps: exercise.reps || null,
        labels: [],
      }
    })

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error("Error in getStretchExercises:", error)
    return NextResponse.json([])
  }
}
