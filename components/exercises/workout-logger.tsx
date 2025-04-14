"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseBrowser } from "@/lib/supabase"
import type { WorkoutLoggerProps } from "@/lib/types"

export function WorkoutLogger({ exerciseId, exerciseName, exerciseType }: WorkoutLoggerProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const logWorkout = async () => {
    if (!user) return

    setIsLogging(true)

    try {
      const { error } = await supabase.from("workout_logs").insert({
        user_id: user.id,
        exercise_id: exerciseId,
        exercise_name: exerciseName,
        exercise_type: exerciseType,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error

      setIsCompleted(true)
      toast({
        title: "Workout logged!",
        description: "Great job completing this exercise.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error logging workout:", error)
      toast({
        title: "Failed to log workout",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Track Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isCompleted ? (
          <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>Exercise completed! Great job!</span>
          </div>
        ) : (
          <Button onClick={logWorkout} disabled={isLogging} className="w-full" size="lg">
            <Clock className="h-4 w-4 mr-2" />
            {isLogging ? "Logging..." : "Complete Exercise"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

