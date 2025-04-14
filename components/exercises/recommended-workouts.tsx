"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
// Update imports for moved components
import ExerciseImage from "@/components/exercises/exercise-image"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseBrowser } from "@/lib/supabase"

interface RecommendedWorkout {
  id: number
  name: string
  image: string
  type: "warmup" | "stretch" | "fit"
}

export function RecommendedWorkouts() {
  const [workouts, setWorkouts] = useState<RecommendedWorkout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return

      try {
        // Get user's fitness level from metadata
        const fitnessLevel = user.user_metadata?.fitness_level || "Beginner"

        // Fetch recent workout logs to avoid recommending recently completed exercises
        const { data: recentLogs } = await supabase
          .from("workout_logs")
          .select("exercise_id")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(10)

        const recentExerciseIds = recentLogs?.map((log) => log.exercise_id) || []

        // Fetch exercises based on fitness level and not recently completed
        const { data: exercises } = await supabase
          .from("exercises")
          .select("id, name, image_url, categories(name)")
          .limit(3)

        if (exercises) {
          const recommendations = exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            image: exercise.image_url || "/placeholder.svg?height=200&width=300",
            type: getExerciseType(exercise.categories?.name),
          }))

          setWorkouts(recommendations)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [user, supabase])

  // Helper function to determine exercise type from category name
  const getExerciseType = (categoryName?: string): "warmup" | "stretch" | "fit" => {
    if (!categoryName) return "fit"

    const lowerCaseName = categoryName.toLowerCase()
    if (lowerCaseName.includes("warmup")) return "warmup"
    if (lowerCaseName.includes("stretch")) return "stretch"
    return "fit"
  }

  // Get the correct link prefix based on exercise type
  const getLinkPrefix = (type: "warmup" | "stretch" | "fit") => {
    switch (type) {
      case "warmup":
        return "/warmup"
      case "stretch":
        return "/stretch"
      case "fit":
        return "/fir"
      default:
        return "/warmup"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (workouts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <Link key={workout.id} href={`${getLinkPrefix(workout.type)}/${workout.id}`} className="block">
              <div className="space-y-2">
                <div className="aspect-video rounded-md overflow-hidden">
                  <ExerciseImage
                    src={workout.image}
                    alt={workout.name}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium truncate">{workout.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

