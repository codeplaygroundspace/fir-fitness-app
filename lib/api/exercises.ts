import { supabaseServer } from "@/lib/supabase"
import type { Exercise, ExerciseWithLabels, ExerciseDetails } from "@/lib/types"

/**
 * Fetches a single exercise by ID with complete details
 */
export async function getExerciseById(id: string | number): Promise<ExerciseDetails | null> {
  try {
    // Convert id to number if it's a string
    const exerciseId = typeof id === "string" ? Number.parseInt(id, 10) : id

    if (isNaN(exerciseId)) {
      console.error(`Invalid exercise ID: ${id}`)
      return null
    }

    // Fetch the exercise with its category
    const { data: exercise, error } = await supabaseServer
      .from("exercises")
      .select(`
        *,
        categories(
          id, 
          name
        )
      `)
      .eq("id", exerciseId)
      .single()

    if (error) {
      console.error(`Error fetching exercise ${exerciseId}:`, error)
      return null
    }

    if (!exercise) {
      return null
    }

    // Fetch exercise labels if they exist
    const { data: labels, error: labelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .eq("exercise_id", exerciseId)

    if (labelsError) {
      console.error(`Error fetching labels for exercise ${exerciseId}:`, labelsError)
    }

    // Map to our application model
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.ex_description,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      videoUrl: exercise.video_url,
      duration: exercise.duration,
      reps: exercise.reps,
      categoryId: exercise.category_id,
      categoryName: exercise.categories?.name || "",
      labels:
        labels?.map((label) => ({
          name: label.label_name,
          type: label.label_type,
        })) || [],
      createdAt: exercise.created_at,
    }
  } catch (error) {
    console.error(`Unexpected error fetching exercise ${id}:`, error)
    return null
  }
}

/**
 * Fetches a minimal version of an exercise by ID (for lists and cards)
 */
export async function getExerciseMinimal(id: string | number): Promise<Exercise | null> {
  try {
    const exerciseId = typeof id === "string" ? Number.parseInt(id, 10) : id

    if (isNaN(exerciseId)) {
      console.error(`Invalid exercise ID: ${id}`)
      return null
    }

    // Only select the fields we need for a card/list view
    const { data, error } = await supabaseServer
      .from("exercises")
      .select(`
        id,
        name,
        image_url,
        duration,
        reps,
        category_id,
        categories(name)
      `)
      .eq("id", exerciseId)
      .single()

    if (error) {
      console.error(`Error fetching minimal exercise ${exerciseId}:`, error)
      return null
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      image: data.image_url || "/placeholder.svg?height=200&width=300",
      duration: data.duration,
      type: getCategoryType(data.categories?.name),
    }
  } catch (error) {
    console.error(`Unexpected error fetching minimal exercise ${id}:`, error)
    return null
  }
}

/**
 * Fetches related exercises based on category (limited count)
 */
export async function getRelatedExercises(
  exerciseId: string | number,
  categoryId: string,
  limit = 4,
): Promise<Exercise[]> {
  try {
    const id = typeof exerciseId === "string" ? Number.parseInt(exerciseId, 10) : exerciseId

    // Get exercises in the same category, excluding the current one
    const { data, error } = await supabaseServer
      .from("exercises")
      .select(`
        id,
        name,
        image_url,
        duration,
        categories(name)
      `)
      .eq("category_id", categoryId)
      .neq("id", id)
      .limit(limit)

    if (error) {
      console.error(`Error fetching related exercises for ${exerciseId}:`, error)
      return []
    }

    return (data || []).map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      duration: exercise.duration,
      type: getCategoryType(exercise.categories?.name),
    }))
  } catch (error) {
    console.error(`Unexpected error fetching related exercises for ${exerciseId}:`, error)
    return []
  }
}

/**
 * Fetches paginated exercises by category type
 */
export async function getPaginatedExercisesByType(
  type: "warmup" | "stretch" | "fit",
  page = 1,
  pageSize = 10,
): Promise<{ exercises: ExerciseWithLabels[]; total: number }> {
  try {
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
    }

    // Get the category ID
    const { data: categoryData } = await supabaseServer.from("categories").select("id").ilike("name", categoryPattern)

    if (!categoryData || categoryData.length === 0) {
      return { exercises: [], total: 0 }
    }

    const categoryId = categoryData[0].id
    const start = (page - 1) * pageSize

    // Get total count
    const { count, error: countError } = await supabaseServer
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId)

    if (countError) {
      console.error(`Error counting ${type} exercises:`, countError)
      return { exercises: [], total: 0 }
    }

    // Get paginated data
    const { data: exercises, error } = await supabaseServer
      .from("exercises")
      .select(`
        id,
        name,
        ex_description,
        image_url,
        duration,
        reps,
        categories(name)
      `)
      .eq("category_id", categoryId)
      .range(start, start + pageSize - 1)
      .order("name")

    if (error) {
      console.error(`Error fetching ${type} exercises:`, error)
      return { exercises: [], total: 0 }
    }

    // Map to our application model
    const mappedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration,
      reps: exercise.reps,
      labels: [],
      categories: getDefaultCategories(exercise.name),
    }))

    return {
      exercises: mappedExercises,
      total: count || 0,
    }
  } catch (error) {
    console.error(`Error in getPaginatedExercisesByType for ${type}:`, error)
    return { exercises: [], total: 0 }
  }
}

/**
 * Fetches exercises for a specific group
 */
export async function getExercisesByGroup(
  groupId: number,
  page = 1,
  pageSize = 20,
): Promise<{ exercises: ExerciseWithLabels[]; total: number }> {
  try {
    const start = (page - 1) * pageSize

    // Get total count
    const { count, error: countError } = await supabaseServer
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("exercise_group", groupId.toString())

    if (countError) {
      console.error(`Error counting exercises for group ${groupId}:`, countError)
      return { exercises: [], total: 0 }
    }

    // Get paginated data
    const { data: exercises, error } = await supabaseServer
      .from("exercises")
      .select(`
        id,
        name,
        ex_description,
        image_url,
        duration,
        reps
      `)
      .eq("exercise_group", groupId.toString())
      .range(start, start + pageSize - 1)
      .order("name")

    if (error) {
      console.error(`Error fetching exercises for group ${groupId}:`, error)
      return { exercises: [], total: 0 }
    }

    // Map to our application model
    const mappedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration,
      reps: exercise.reps,
      labels: [],
      categories: getDefaultCategories(exercise.name),
    }))

    return {
      exercises: mappedExercises,
      total: count || 0,
    }
  } catch (error) {
    console.error(`Error in getExercisesByGroup for ${groupId}:`, error)
    return { exercises: [], total: 0 }
  }
}

/**
 * Gets a single exercise group by ID
 */
export async function getExerciseGroupById(id: string | number): Promise<{
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
} | null> {
  try {
    const groupId = typeof id === "string" ? Number.parseInt(id, 10) : id

    if (isNaN(groupId)) {
      console.error(`Invalid group ID: ${id}`)
      return null
    }

    const { data, error } = await supabaseServer.from("exercise_groups").select("*").eq("id", groupId).single()

    if (error) {
      console.error(`Error fetching exercise group ${groupId}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Unexpected error fetching exercise group ${id}:`, error)
    return null
  }
}

// Helper function to determine exercise type from category name
function getCategoryType(categoryName?: string): "warmup" | "stretch" | "fit" {
  if (!categoryName) return "fit"

  const lowerCaseName = categoryName.toLowerCase()
  if (lowerCaseName.includes("warmup")) return "warmup"
  if (lowerCaseName.includes("stretch")) return "stretch"
  return "fit"
}

// Helper function to assign default categories based on exercise name
function getDefaultCategories(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const categories: string[] = []

  // Assign body region
  if (name.includes("press") || name.includes("pull") || name.includes("overhead")) {
    categories.push("Upper")
  } else if (name.includes("thrust") || name.includes("brace") || name.includes("lateral")) {
    categories.push("Middle")
  } else if (name.includes("squat") || name.includes("deadlift") || name.includes("raise")) {
    categories.push("Lower")
  }

  // Assign FIR level (just a default)
  categories.push("FIR: Low")

  return categories
}
