// Client-side functions that call API routes instead of server actions

export async function getCategories() {
  try {
    const response = await fetch("/api/admin/categories")
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createExercise(formData: FormData) {
  try {
    const response = await fetch("/api/admin/exercises", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to create exercise")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating exercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateExercise(id: number, formData: FormData) {
  try {
    const response = await fetch(`/api/admin/exercises/${id}`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to update exercise")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating exercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteExercise(id: number) {
  try {
    const response = await fetch(`/api/admin/exercises/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete exercise")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting exercise:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getExerciseForEdit(id: number) {
  try {
    const response = await fetch(`/api/admin/exercises/${id}/edit`)
    if (!response.ok) {
      throw new Error("Failed to fetch exercise for edit")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching exercise for edit:", error)
    return null
  }
}
