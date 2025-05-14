'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRecord } from '@/contexts/record-context'

interface MonthlyCalendarProps {
  className?: string
}

export function MonthlyCalendar({ className }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { toggleWorkoutDay, isWorkoutCompleted, isLoading, error } = useRecord()

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = (month + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    // Adjust for starting week on Sunday (0) or Monday (1)
    const startDay = 1 // 0 for Sunday, 1 for Monday
    const adjustedFirstDay = (firstDayOfMonth - startDay + 7) % 7

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 p-1"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, month, day)
      const completed = isWorkoutCompleted(date)
      const isToday =
        date === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

      days.push(
        <div key={date} className={cn('h-10 p-1 relative', isToday && 'font-bold')}>
          <button
            onClick={() => toggleWorkoutDay(date)}
            disabled={isLoading}
            className={cn(
              'h-full w-full flex items-center justify-center rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isToday && 'ring-1 ring-primary',
              completed
                ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                : 'border-2 border-border hover:border-primary/50',
              isLoading && 'opacity-70 cursor-not-allowed'
            )}
            aria-label={`${completed ? 'Completed' : 'Not completed'} workout on ${month + 1}/${day}/${year}`}
            aria-pressed={completed}
          >
            <span className={cn('z-10', completed && 'text-primary-foreground')}>{day}</span>
          </button>
        </div>
      )
    }

    return days
  }

  // Get month name
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString('default', { month: 'long' })
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error loading workout data: {error}</span>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading workout data...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">{renderCalendar()}</div>
        </>
      )}
    </div>
  )
}
