"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ExerciseTimerProps } from "@/lib/types"

export function ExerciseTimer({ duration, onComplete }: ExerciseTimerProps) {
  // Parse duration string (e.g., "30 sec" to 30)
  const parseDuration = (durationString: string | number): number => {
    if (typeof durationString === "number") return durationString

    const match = durationString.match(/(\d+)/)
    return match ? Number.parseInt(match[0], 10) : 30 // Default to 30 if parsing fails
  }

  const initialSeconds = parseDuration(duration)
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false) // Start inactive
  const [progress, setProgress] = useState(100)
  const [pageLoaded, setPageLoaded] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Start or pause timer
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(initialSeconds)
    setProgress(100)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Effect for timer functionality
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          // Calculate progress percentage
          setProgress((newTime / initialSeconds) * 100)
          return newTime
        })
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      if (onComplete) onComplete()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, timeLeft, initialSeconds, onComplete])

  // Effect to detect when page is loaded and start timer after delay
  useEffect(() => {
    // Mark page as loaded
    setPageLoaded(true)

    // Clean up any existing timeout
    return () => {
      if (startTimerTimeoutRef.current) {
        clearTimeout(startTimerTimeoutRef.current)
      }
    }
  }, [])

  // Effect to start timer after page load and delay
  useEffect(() => {
    if (pageLoaded) {
      // Start timer after 1 second delay
      startTimerTimeoutRef.current = setTimeout(() => {
        setIsActive(true)
      }, 1000)
    }

    return () => {
      if (startTimerTimeoutRef.current) {
        clearTimeout(startTimerTimeoutRef.current)
      }
    }
  }, [pageLoaded])

  return (
    <Card className="my-4">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Exercise Timer</h3>
            <div className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              aria-label={isActive ? "Pause timer" : "Start timer"}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="icon" onClick={resetTimer} aria-label="Reset timer">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
