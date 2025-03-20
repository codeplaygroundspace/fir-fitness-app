"use server"

import { supabaseServer } from "@/lib/supabase"

export type ExerciseWithLabels = {
  id: number
  name: string
  image: string
  description: string | null
  duration: string | null
  reps: string | null
  labels: {
    label_name: string
    label_type: string
  }[]
  categories?: string[]
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

    // Get all duration labels
    const { data: durationLabels, error: durationLabelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .eq("label_type", "duration")

    if (durationLabelsError) {
      console.error("Error fetching duration labels:", durationLabelsError)
    }

    // Get all reps labels
    const { data: repsLabels, error: repsLabelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .eq("label_type", "reps")

    if (repsLabelsError) {
      console.error("Error fetching reps labels:", repsLabelsError)
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      // Find a duration label (for now just use the first one since exercise_id is null)
      const durationLabel = durationLabels && durationLabels.length > 0 ? durationLabels[0].label_name : "30"

      // Find a reps label
      const repsLabel = repsLabels && repsLabels.length > 0 ? repsLabels[0].label_name : "4"

      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: durationLabel,
        reps: repsLabel,
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

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: "15-30", // Default duration for stretches
        reps: null,
        labels: [],
      }
    })
  } catch (error) {
    console.error("Error in getStretchExercises:", error)
    return []
  }
}

export async function getFitExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the FIT category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from("categories")
      .select("id")
      .ilike("name", "%fit%") // Using ilike for case-insensitive partial matching

    if (categoryError || !categoryData || categoryData.length === 0) {
      console.error("Error or no FIT category found:", categoryError)

      // Let's try to get all categories to see what's available
      const { data: allCategories } = await supabaseServer.from("categories").select("id, name")

      console.log("Available categories:", allCategories)

      // If we can't find a FIT category, return empty array
      return []
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

    // Get all exercise labels for FIT exercises
    const { data: exerciseLabels, error: labelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .in(
        "exercise_id",
        exercises.map((ex) => ex.id),
      )

    if (labelsError) {
      console.error("Error fetching exercise labels:", labelsError)
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      // Find labels for this specific exercise
      const exerciseSpecificLabels = exerciseLabels?.filter((label) => label.exercise_id === exercise.id) || []

      // Extract categories from labels
      const categories =
        exerciseSpecificLabels.length > 0
          ? exerciseSpecificLabels.map((label) => label.label_name)
          : getDefaultCategories(exercise.name)

      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || "/placeholder.svg?height=200&width=300",
        description: exercise.ex_description,
        duration: null,
        reps: null,
        labels: exerciseSpecificLabels,
        categories,
      }
    })
  } catch (error) {
    console.error("Error in getFitExercises:", error)
    return []
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

export async function getExerciseById(id: number): Promise<ExerciseWithLabels | undefined> {
  try {
    const { data: exercise, error } = await supabaseServer.from("exercises").select("*").eq("id", id).single()

    if (error || !exercise) {
      console.error("Error fetching exercise:", error)
      return undefined
    }

    // Get all exercise labels for this exercise
    const { data: exerciseLabels, error: labelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .eq("exercise_id", id)

    if (labelsError) {
      console.error("Error fetching exercise labels:", labelsError)
    }

    // Extract categories from labels
    const categories = exerciseLabels?.map((label) => label.label_name) || getDefaultCategories(exercise.name)

    return {
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || "/placeholder.svg?height=200&width=300",
      description: exercise.ex_description,
      duration: null,
      reps: null,
      labels: exerciseLabels || [],
      categories,
    }
  } catch (error) {
    console.error("Error in getExerciseById:", error)
    return undefined
  }
}

