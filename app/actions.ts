"use server"

import { supabaseServer } from "@/lib/supabase"
import type { ExerciseWithLabels } from "@/lib/types"

// Update the ExerciseGroup type to include category_id
export type ExerciseGroup = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
  category_id?: string // Add this field as optional
}

export async function getWarmupExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the warmup category ID - using .eq without .single()
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%warmup%") // Using ilike for case-insensitive partial matching

    if (categoryError || !categoryData || categoryData.length === 0) {
      console.error("Error or no warmup category found:", categoryError)

      // Let's try to get all categories to see what's available
      const { data: allCategories } = await supabaseServer.from("categories").select("id, name")

      console.log("Available categories:", allCategories)

      // If we can't find a warmup category, return empty array
      return []
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
      return []
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: exercise.duration || "30",
        reps: exercise.reps || "4",
        labels: [],
      }
    })
  } catch (error) {
    console.error("Error in getWarmupExercises:", error)
    return []
  }
}

export async function getStretchExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the stretch category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%stretch%") // Using ilike for case-insensitive partial matching

    if (categoryError || !categoryData || categoryData.length === 0) {
      console.error("Error or no stretch category found:", categoryError)

      // Let's try to get all categories to see what's available
      const { data: allCategories } = await supabaseServer.from("categories").select("id, name")

      console.log("Available categories:", allCategories)

      // If we can't find a stretch category, return empty array
      return []
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
      return []
    }

    console.log(
      "Raw stretch exercises from DB:",
      exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        image_url: ex.image_url,
      })),
    )

    // Map exercises to the format we need
    return exercises.map((exercise) => {
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
  } catch (error) {
    console.error("Error in getStretchExercises:", error)
    return []
  }
}

// Update the getFitExercises function to handle the missing exercise_id column

export async function getFitExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, try to get the FIT category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%fit%") // Only search for "fit" pattern

    if (categoryError) {
      console.error("Error fetching FIT category:", categoryError)
    }

    // If no category found, try to get all exercises as a fallback
    if (!categoryData || categoryData.length === 0) {
      console.log("No FIT category found, fetching all exercises as fallback")

      // Get all exercises as a fallback
      const { data: allExercises, error: exercisesError } = await supabaseServer.from("exercises").select("*").limit(20) // Limit to a reasonable number

      if (exercisesError || !allExercises) {
        console.error("Error fetching fallback exercises:", exercisesError)
        return []
      }

      // Map exercises to the format we need
      return allExercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }))
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
      return []
    }

    // Skip fetching exercise labels since the column doesn't exist
    // Just use default categories for all exercises
    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }
    })
  } catch (error) {
    console.error("Error in getFitExercises:", error)
    return []
  }
}

// Update the getExerciseById function to handle the missing exercise_id column

export async function getExerciseById(id: number): Promise<ExerciseWithLabels | undefined> {
  try {
    const { data: exercise, error } = await supabaseServer.from("exercises").select("*").eq("id", id).single()

    if (error || !exercise) {
      console.error("Error fetching exercise:", error)
      return undefined
    }

    // Skip fetching exercise labels since the column doesn't exist
    // Just use default categories
    return {
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
      categories: getDefaultCategories(exercise.name),
    }
  } catch (error) {
    console.error("Error in getExerciseById:", error)
    return undefined
  }
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

// Add a function to get exercises by type (to replace getExercisesByType)
export async function getExercisesByType(type: "warmup" | "stretch" | "fit"): Promise<ExerciseWithLabels[]> {
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
      return []
    }

    const categoryId = categoryData[0].id

    // Get exercises in this category
    const { data: exercises, error } = await supabaseServer.from("exercises").select("*").eq("category_id", categoryId)

    if (error || !exercises) {
      console.error(`Error fetching ${type} exercises:`, error)
      return []
    }

    // Map to the expected format
    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
      categories: [],
    }))
  } catch (error) {
    console.error(`Error in getExercisesByType for ${type}:`, error)
    return []
  }
}

// Add this new function to fetch exercise groups
export async function getExerciseGroups(): Promise<ExerciseGroup[]> {
  try {
    const { data: groups, error } = await supabaseServer.from("exercise_groups").select("*").order("name")

    if (error || !groups) {
      console.error("Error fetching exercise groups:", error)
      return []
    }

    return groups
  } catch (error) {
    console.error("Error in getExerciseGroups:", error)
    return []
  }
}

// Update the getExercisesByGroup function to use the exercise_group column
export async function getExercisesByGroup(groupId: number): Promise<ExerciseWithLabels[]> {
  try {
    console.log(`Fetching exercises for group ID: ${groupId}`)

    // First, get the group details to know what we're looking for
    const { data: group, error: groupError } = await supabaseServer
      .from("exercise_groups")
      .select("*")
      .eq("id", groupId)
      .single()

    if (groupError || !group) {
      console.error(`Error fetching group ${groupId}:`, groupError)
      return []
    }

    // Primary approach: Use the exercise_group column (this is the correct column name)
    // We need to convert groupId to string since that's how it's stored in the database
    const { data: exercisesByGroup, error: groupError2 } = await supabaseServer
      .from("exercises")
      .select("*")
      .eq("exercise_group", groupId.toString())

    if (!groupError2 && exercisesByGroup && exercisesByGroup.length > 0) {
      console.log(`Found ${exercisesByGroup.length} exercises with exercise_group=${groupId}`)

      // Map to the expected format
      return exercisesByGroup.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }))
    }

    // If no exercises found with the exact exercise_group, we'll return an empty array
    // This is what the user wants - only show exercises that match the specific group
    console.log(`No exercises found with exercise_group=${groupId}`)
    return []
  } catch (error) {
    console.error(`Error in getExercisesByGroup for ${groupId}:`, error)
    return []
  }
}
