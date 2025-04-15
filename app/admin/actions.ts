"use server"

import { revalidatePath } from "next/cache"
import { supabaseServer } from "@/lib/supabase"

export type ExerciseFormData = {
  name: string
  description: string | null
  image_url: string | null
  video_url: string | null
  category_id: string
  labels: string[]
}

export async function getCategories() {
  const { data, error } = await supabaseServer.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

export async function createExercise(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const image_url = formData.get("image_url") as string
    const video_url = formData.get("video_url") as string
    const category_id = formData.get("category_id") as string
    const labels = formData.getAll("labels") as string[]

    if (!name || !category_id) {
      return { error: "Name and category are required" }
    }

    // Insert the exercise
    const { data: exercise, error: exerciseError } = await supabaseServer
      .from("exercises")
      .insert({
        name,
        ex_description: description || null,
        image_url: image_url || null,
        video_url: video_url || null,
        category_id,
      })
      .select()
      .single()

    if (exerciseError) {
      console.error("Error creating exercise:", exerciseError)
      return { error: "Failed to create exercise" }
    }

    // Insert labels if any
    if (labels.length > 0) {
      const labelInserts = labels.map((label) => ({
        exercise_id: exercise.id,
        label_name: label,
        label_type: label.includes("FIR:") ? "risk_level" : "body_region",
      }))

      const { error: labelsError } = await supabaseServer.from("exercise_labels").insert(labelInserts)

      if (labelsError) {
        console.error("Error adding labels:", labelsError)
      }
    }

    revalidatePath("/admin")
    return { success: true, id: exercise.id }
  } catch (error) {
    console.error("Error in createExercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateExercise(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const image_url = formData.get("image_url") as string
    const video_url = formData.get("video_url") as string
    const category_id = formData.get("category_id") as string
    const labels = formData.getAll("labels") as string[]

    if (!name || !category_id) {
      return { error: "Name and category are required" }
    }

    // Update the exercise
    const { error: exerciseError } = await supabaseServer
      .from("exercises")
      .update({
        name,
        ex_description: description || null,
        image_url: image_url || null,
        video_url: video_url || null,
        category_id,
      })
      .eq("id", id)

    if (exerciseError) {
      console.error("Error updating exercise:", exerciseError)
      return { error: "Failed to update exercise" }
    }

    // Delete existing labels
    const { error: deleteLabelsError } = await supabaseServer.from("exercise_labels").delete().eq("exercise_id", id)

    if (deleteLabelsError) {
      console.error("Error deleting labels:", deleteLabelsError)
    }

    // Insert new labels if any
    if (labels.length > 0) {
      const labelInserts = labels.map((label) => ({
        exercise_id: id,
        label_name: label,
        label_type: label.includes("FIR:") ? "risk_level" : "body_region",
      }))

      const { error: labelsError } = await supabaseServer.from("exercise_labels").insert(labelInserts)

      if (labelsError) {
        console.error("Error adding labels:", labelsError)
      }
    }

    revalidatePath("/admin")
    revalidatePath(`/admin/exercises/${id}`)
    return { success: true, id }
  } catch (error) {
    console.error("Error in updateExercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteExercise(id: number) {
  try {
    // Delete labels first (foreign key constraint)
    const { error: deleteLabelsError } = await supabaseServer.from("exercise_labels").delete().eq("exercise_id", id)

    if (deleteLabelsError) {
      console.error("Error deleting labels:", deleteLabelsError)
    }

    // Delete the exercise
    const { error: deleteExerciseError } = await supabaseServer.from("exercises").delete().eq("id", id)

    if (deleteExerciseError) {
      console.error("Error deleting exercise:", deleteExerciseError)
      return { error: "Failed to delete exercise" }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteExercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getExerciseForEdit(id: number) {
  try {
    // Get the exercise
    const { data: exercise, error: exerciseError } = await supabaseServer
      .from("exercises")
      .select("*, categories(name)")
      .eq("id", id)
      .single()

    if (exerciseError) {
      console.error("Error fetching exercise:", exerciseError)
      return null
    }

    // Get the labels
    const { data: labels, error: labelsError } = await supabaseServer
      .from("exercise_labels")
      .select("*")
      .eq("exercise_id", id)

    if (labelsError) {
      console.error("Error fetching labels:", labelsError)
    }

    return {
      ...exercise,
      labels: labels?.map((label) => label.label_name) || [],
    }
  } catch (error) {
    console.error("Error in getExerciseForEdit:", error)
    return null
  }
}
