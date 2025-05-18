'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { saveMobilityLimitations } from '@/app/mobilise/actions'

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
  const [mobilityLimitations, setMobilityLimitations] = useState(initialLimitations)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleMobilityLimitationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobilityLimitations(e.target.value)
  }

  const handleMobilityLimitationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setSaveError('You must be logged in to save your mobility limitations')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const result = await saveMobilityLimitations(userId, mobilityLimitations)
      if (!result.success) {
        setSaveError('Failed to save your mobility limitations. Please try again.')
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
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
        <span>Loading your mobility data...</span>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleMobilityLimitationsSubmit}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <label htmlFor="mobilityLimitations" className="sr-only">
            Record stiff muscles and severity
          </label>
          <Input
            id="mobilityLimitations"
            value={mobilityLimitations}
            onChange={handleMobilityLimitationsChange}
            placeholder="Record stiff muscles and severity (e.g., 'lower back 6/10')"
            className="w-full"
            aria-describedby="mobility-limitations-description"
            disabled={isSaving}
          />
          <div id="mobility-limitations-description" className="sr-only">
            Enter the names of stiff muscles and their severity on a scale of 1-10
          </div>
        </div>
      </div>
      {saveError && <div className="text-sm text-destructive">{saveError}</div>}
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
    </form>
  )
}
