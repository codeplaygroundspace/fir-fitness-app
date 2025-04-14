// Client-side functions that call API routes instead of server actions

export async function getUserWorkouts(userId: string) {
  try {
    const response = await fetch(`/api/workout-days?userId=${userId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch user workouts")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching user workouts:", error)
    return []
  }
}

export async function toggleWorkoutDay(userId: string, date: string, completed: boolean) {
  try {
    const response = await fetch("/api/workout-days", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, date, completed }),
    })

    if (!response.ok) {
      throw new Error("Failed to toggle workout day")
    }

    return await response.json()
  } catch (error) {
    console.error("Error toggling workout day:", error)
    return { success: false }
  }
}
