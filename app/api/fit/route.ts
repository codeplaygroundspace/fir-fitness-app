import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // First, try to get the FIT category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%fit%")

    if (categoryError) {
      console.error("Error fetching FIT category:", categoryError)
    }

    // If no category found, try to get all exercises as a fallback
    if (!categoryData || categoryData.length === 0) {
      console.log("No FIT category found, fetching all exercises as fallback")

      // Get all exercises as a fallback
      const { data: allExercises, error: exercisesError } = await supabaseServer.from("exercises").select("*").limit(20)

      if (exercisesError || !allExercises) {
        console.error("Error fetching fallback exercises:", exercisesError)
        return NextResponse.json([])
      }

      // Map exercises to the format we need
      const formattedExercises = allExercises.map((exercise) => ({
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

    // Use the first category that matches
    const fitCategoryId = categoryData[0].id

    // Now get all exercises in the FIT category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from("exercises")
      .select("*")
      .eq("category_id", fitCategoryId)

    if (exercisesError || !exercises) {
      console.error("Error fetching FIT exercises:", exercisesError)
      return NextResponse.json([])
    }

    // Map exercises to the format we need
    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
    }))

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error("Error in getFitExercises:", error)
    return NextResponse.json([])
  }
}
