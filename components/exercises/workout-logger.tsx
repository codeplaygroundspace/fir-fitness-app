'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Clock, CheckCircle, Circle } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { getSupabaseBrowser } from '@/lib/supabase'
import type { WorkoutLoggerProps } from '@/lib/types'
import { saveWorkoutLog } from '@/lib/offline-sync'

export function WorkoutLogger({ exerciseId, exerciseName, exerciseType }: WorkoutLoggerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const handleToggleComplete = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      if (!isCompleted) {
        // Log the workout
        await saveWorkoutLog({
          exercise_id: exerciseId,
          exercise_name: exerciseName,
          exercise_type: exerciseType,
          completed_at: new Date().toISOString(),
        })
      }

      setIsCompleted(!isCompleted)
      toast({
        title: 'Workout logged!',
        description: 'Great job completing this exercise.',
        variant: 'default',
      })
    } catch (error) {
      // Silently handle logging errors
      toast({
        title: 'Failed to log workout',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Track Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleToggleComplete}
          disabled={isLoading}
          variant={isCompleted ? 'default' : 'outline'}
          className="flex items-center gap-2 w-full"
          size="lg"
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </Button>
      </CardContent>
    </Card>
  )
}
