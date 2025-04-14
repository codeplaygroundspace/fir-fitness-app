// Client-side functions that call API routes instead of server actions

export async function getWarmupExercises() {
  try {
    const response = await fetch("/api/warmup")
    if (!response.ok) {
      throw new Error("Failed to fetch warmup exercises")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching warmup exercises:", error)
    return []
  }
}

export async function getStretchExercises() {
  try {
    const response = await fetch("/api/stretch")
    if (!response.ok) {
      throw new Error("Failed to fetch stretch exercises")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching stretch exercises:", error)
    return []
  }
}

// Helper function to assign default categories based on exercise name
export function getDefaultCategories(exerciseName: string) {
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

export async function getFitExercises() {
  try {
    const response = await fetch("/api/fit")
    if (!response.ok) {
      throw new Error("Failed to fetch FIT exercises")
    }
    const exercises = await response.json()

    // Add default categories
    return exercises.map((exercise: any) => ({
      ...exercise,
      categories: getDefaultCategories(exercise.name),
    }))
  } catch (error) {
    console.error("Error fetching FIT exercises:", error)
    return []
  }
}

export async function getExerciseById(id: number) {
  try {
    const response = await fetch(`/api/exercises/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch exercise")
    }
    const exercise = await response.json()

    // Add default categories
    return {
      ...exercise,
      categories: getDefaultCategories(exercise.name),
    }
  } catch (error) {
    console.error("Error fetching exercise:", error)
    return undefined
  }
}

export async function getExerciseGroups() {
  try {
    const response = await fetch("/api/groups")
    if (!response.ok) {
      throw new Error("Failed to fetch exercise groups")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching exercise groups:", error)
    return []
  }
}

export async function getExercisesByGroup(groupId: number) {
  try {
    const response = await fetch(`/api/groups/${groupId}/exercises`)
    if (!response.ok) {
      throw new Error("Failed to fetch exercises for group")
    }
    const exercises = await response.json()

    // Add default categories
    return exercises.map((exercise: any) => ({
      ...exercise,
      categories: getDefaultCategories(exercise.name),
    }))
  } catch (error) {
    console.error(`Error fetching exercises for group ${groupId}:`, error)
    return []
  }
}

export async function getExercisesByType(type: "warmup" | "stretch" | "fit") {
  try {
    const response = await fetch(`/api/exercises/type/${type}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} exercises`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${type} exercises:`, error)
    return []
  }
}
