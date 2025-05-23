'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { saveMobilityLimitations } from '@/app/mobilise/actions'
import { cn } from '@/lib/utils'

interface MobilityLimitationsFormProps {
  userId: string | undefined
  initialLimitations: string
  isLoading: boolean
}

export const MobilityLimitationsForm = ({
  userId,
  initialLimitations,
  isLoading,
}: MobilityLimitationsFormProps) => {
  const [mobilityLimitations, setMobilityLimitations] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedValue, setSavedValue] = useState(initialLimitations)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Update saved value state when initialLimitations changes (e.g. from parent)
  useEffect(() => {
    setSavedValue(initialLimitations)
  }, [initialLimitations])

  // Auto-hide success message after 3 seconds with animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let animationTimeoutId: NodeJS.Timeout

    if (showSuccessMessage) {
      // Start animation out after 2.5 seconds
      animationTimeoutId = setTimeout(() => {
        setIsAnimatingOut(true)
      }, 2500)

      // Hide message after animation completes (3 seconds total)
      timeoutId = setTimeout(() => {
        setShowSuccessMessage(false)
        setIsAnimatingOut(false)
      }, 3000)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (animationTimeoutId) clearTimeout(animationTimeoutId)
    }
  }, [showSuccessMessage])

  const handleMobilityLimitationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobilityLimitations(e.target.value)
  }

  const handleMobilityLimitationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setSaveError('You must be logged in to save your mobility limitations')
      return
    }

    if (!mobilityLimitations.trim()) {
      setSaveError('Please enter your mobility limitations')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const result = await saveMobilityLimitations(userId, mobilityLimitations)
      if (!result.success) {
        setSaveError('Failed to save your mobility limitations. Please try again.')
      } else {
        // Update the saved value and clear the input field
        setSavedValue(mobilityLimitations)
        setMobilityLimitations('')
        setShowSuccessMessage(true)
        setIsAnimatingOut(false)
      }
    } catch (error) {
      console.error('Error saving mobility limitations:', error)
      setSaveError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-center items-center" aria-busy="true" aria-live="polite">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span>Loading your mobility data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleMobilityLimitationsSubmit} aria-busy={isSaving}>
      <Card className="border-0 shadow-sm">
        <CardContent className="py-4 px-2">
          <div className="space-y-2">
            <div>
              <label htmlFor="mobilityLimitations" className="sr-only">
                Record stiff muscles and severity
              </label>
              <Input
                id="mobilityLimitations"
                value={mobilityLimitations}
                onChange={handleMobilityLimitationsChange}
                placeholder="e.g write 11 for 'lower back'"
                className="w-full"
                aria-describedby="mobility-limitations-description"
                disabled={isSaving}
              />
              <div id="mobility-limitations-description" className="sr-only">
                Enter the names of stiff muscles and their severity on a scale of 1-10
              </div>
            </div>

            {saveError && (
              <div className="text-sm text-destructive" role="alert">
                {saveError}
              </div>
            )}

            {savedValue && (
              <div aria-live="polite">
                {showSuccessMessage && (
                  <div
                    className={cn(
                      'flex items-center font-medium text-green-600 mb-1 transition-opacity duration-500',
                      isAnimatingOut ? 'opacity-0' : 'opacity-100'
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 shrink-0" />
                    Saved limitations
                  </div>
                )}
                <p className="text-foreground">
                  <span className="font-bold">Saved:</span> {savedValue}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              aria-label="Save mobility limitations"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
