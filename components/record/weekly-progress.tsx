'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRecord } from '@/contexts/record-context'

interface WeeklyProgressProps {
  className?: string
}

type DayInfo = {
  day: string
  shortName: string
  date: string
}

export function WeeklyProgress({ className }: WeeklyProgressProps) {
  const { toggleWorkoutDay, isWorkoutCompleted, isLoading, error } = useRecord()
  const [weekDays, setWeekDays] = useState<DayInfo[]>([])

  // Initialize days of the week with their dates
  useEffect(() => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const days: DayInfo[] = []

    // Define day names starting with Monday
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // Calculate the date for each day of the current week, starting with Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      // Adjust to get Monday as first day (1) instead of Sunday (0)
      // If today is Sunday (0), we need to go back 6 days for Monday
      // If today is Monday (1), we need to go back 0 days for Monday
      // If today is Tuesday (2), we need to go back 1 day for Monday, etc.
      const adjustedCurrentDay = currentDay === 0 ? 7 : currentDay // Convert Sunday from 0 to 7
      date.setDate(today.getDate() - adjustedCurrentDay + i + 1) // +1 because we want to start with Monday (1)

      days.push({
        day: dayNames[i],
        shortName: shortNames[i],
        date: formatDate(date),
      })
    }

    setWeekDays(days)
  }, [])

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Get the current day index (0 = Monday, 1 = Tuesday, etc. in our adjusted system)
  const currentDayIndex = (() => {
    const day = new Date().getDay() // 0 = Sunday, 1 = Monday in JavaScript
    return day === 0 ? 6 : day - 1 // Convert to 0 = Monday, 6 = Sunday
  })()

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-lg font-semibold" id="weekly-progress-title">
          Weekly Progress
        </h3>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error loading workout data: {error}</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-lg font-semibold" id="weekly-progress-title">
          Weekly Progress
        </h3>
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading workout data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold" id="weekly-progress-title">
        Weekly Progress
      </h3>
      <div className="grid grid-cols-7 gap-2" role="group" aria-labelledby="weekly-progress-title">
        {weekDays.map((day, index) => {
          const isCompleted = isWorkoutCompleted(day.date)

          return (
            <div key={day.day} className="flex flex-col items-center">
              <span
                className={cn(
                  'text-sm mb-1',
                  index === currentDayIndex && 'font-bold text-primary'
                )}
                id={`day-label-${index}`}
              >
                {day.shortName}
                {index === currentDayIndex && <span className="sr-only"> (Today)</span>}
              </span>
              <button
                onClick={() => toggleWorkoutDay(day.date)}
                disabled={isLoading}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border hover:border-primary/50',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
                aria-label={`Mark ${day.day} as ${isCompleted ? 'incomplete' : 'complete'}`}
                aria-pressed={isCompleted}
                aria-describedby={`day-label-${index}`}
              >
                {isCompleted && <Check className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
