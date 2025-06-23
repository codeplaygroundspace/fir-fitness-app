'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { saveExerciseNote } from '@/app/strengthen/actions'

interface ExerciseNotesFormProps {
  userId: string | undefined
  exerciseId: number
  initialNote: string
  isLoading: boolean
}

export const ExerciseNotesForm = ({
  userId,
  exerciseId,
  initialNote,
  isLoading,
}: ExerciseNotesFormProps) => {
  const [note, setNote] = useState('')
  const [savedNote, setSavedNote] = useState(initialNote)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Update saved note when initialNote changes
  useEffect(() => {
    setSavedNote(initialNote)
  }, [initialNote])

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timeout = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [showSuccessMessage])

  const handleInputChange = (value: string) => {
    setNote(value)
  }

  const handleSaveNote = async () => {
    if (!userId) {
      setSaveError('You must be logged in to save your notes')
      return
    }

    const noteValue = note.trim()
    if (!noteValue) {
      setSaveError('Please enter your note before saving')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const result = await saveExerciseNote(userId, exerciseId, noteValue)
      if (!result.success) {
        setSaveError('Failed to save your note. Please try again.')
      } else {
        // Update saved value and clear input
        setSavedNote(noteValue)
        setNote('')
        setShowSuccessMessage(true)
      }
    } catch (error) {
      console.error('Error saving exercise note:', error)
      setSaveError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div
            className="flex justify-center items-center py-4"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span>Loading your notes...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          <Input
            value={note}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="Write your exercise notes here (e.g., technique reminders, reps/sets/weight)..."
            className="w-full"
            disabled={isSaving}
            aria-label="Exercise notes input"
          />
          <Button
            onClick={handleSaveNote}
            disabled={isSaving || !note.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            aria-label="Save exercise note"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save notes'
            )}
          </Button>

          {saveError && (
            <div className="text-sm text-destructive" role="alert">
              {saveError}
            </div>
          )}

          {savedNote && (
            <div aria-live="polite">
              {showSuccessMessage && (
                <div className="flex items-center font-medium text-green-600 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 shrink-0" />
                  Notes saved successfully
                </div>
              )}
              <p className="text-foreground">
                <span className="font-bold">Current notes:</span> {savedNote}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
