import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const type = params.type

    // Map the type to the appropriate category name pattern
    let categoryPattern: string
    switch (type) {
      case "warmup":
        categoryPattern = "%warmup%"
        break
      case "stretch":
        categoryPattern = "%stretch%"
        break
      case "fit":
        categoryPattern = "%fit%"
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    // Get the category ID
    const { data: categoryData } = await supabaseServer.from("categories").select("id").ilike("name", categoryPattern)

    if (!categoryData || categoryData.length === 0) {
      return NextResponse.json([])
    }

    const categoryId = categoryData[0].id

    // Get exercises in this category
    const { data: exercises, error } = await supabaseServer.from("exercises").select("*").eq("category_id", categoryId)

    if (error || !exercises) {
      console.error(`Error fetching ${type} exercises:`, error)
      return NextResponse.json([])
    }

    // Map to the expected format
    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
      categories: [],
    }))

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error(`Error in getExercisesByType for ${params.type}:`, error)
    return NextResponse.json([])
  }
}
