'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, Save } from 'lucide-react'
import { saveGoalNote, type GoalNotes } from '@/app/record/actions'
import { cn } from '@/lib/utils'

interface GoalNotesFormProps {
  userId: string | undefined
  initialGoalNotes: GoalNotes
  isLoading: boolean
}

type GoalCategory = 'pain' | 'posture' | 'performance' | 'physique'

interface GoalField {
  key: GoalCategory
  label: string
  placeholder: string
}

const goalFields: GoalField[] = [
  {
    key: 'pain',
    label: 'Pain',
    placeholder: 'Write your pain-related goals here...',
  },
  {
    key: 'posture',
    label: 'Posture',
    placeholder: 'Write your posture-related goals here...',
  },
  {
    key: 'performance',
    label: 'Performance',
    placeholder: 'Write your performance-related goals here...',
  },
  {
    key: 'physique',
    label: 'Physique',
    placeholder: 'Write your physique-related goals here...',
  },
]

export const GoalNotesForm = ({ userId, initialGoalNotes, isLoading }: GoalNotesFormProps) => {
  const [goalNotes, setGoalNotes] = useState<GoalNotes>({
    pain: '',
    posture: '',
    performance: '',
    physique: '',
  })
  const [savedGoalNotes, setSavedGoalNotes] = useState<GoalNotes>(initialGoalNotes)
  const [savingStates, setSavingStates] = useState<Record<GoalCategory, boolean>>({
    pain: false,
    posture: false,
    performance: false,
    physique: false,
  })
  const [saveErrors, setSaveErrors] = useState<Record<GoalCategory, string | null>>({
    pain: null,
    posture: null,
    performance: null,
    physique: null,
  })
  const [successMessages, setSuccessMessages] = useState<Record<GoalCategory, boolean>>({
    pain: false,
    posture: false,
    performance: false,
    physique: false,
  })

  // Update saved goal notes when initialGoalNotes changes
  useEffect(() => {
    setSavedGoalNotes(initialGoalNotes)
  }, [initialGoalNotes])

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    Object.entries(successMessages).forEach(([category, isVisible]) => {
      if (isVisible) {
        const timeout = setTimeout(() => {
          setSuccessMessages(prev => ({
            ...prev,
            [category]: false,
          }))
        }, 3000)
        timeouts.push(timeout)
      }
    })

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [successMessages])

  const handleInputChange = (category: GoalCategory, value: string) => {
    setGoalNotes(prev => ({
      ...prev,
      [category]: value,
    }))
  }

  const handleSaveGoalNote = async (category: GoalCategory) => {
    if (!userId) {
      setSaveErrors(prev => ({
        ...prev,
        [category]: 'You must be logged in to save your goals',
      }))
      return
    }

    const noteValue = goalNotes[category].trim()
    if (!noteValue) {
      setSaveErrors(prev => ({
        ...prev,
        [category]: 'Please enter your goal before saving',
      }))
      return
    }

    setSavingStates(prev => ({ ...prev, [category]: true }))
    setSaveErrors(prev => ({ ...prev, [category]: null }))

    try {
      const result = await saveGoalNote(userId, category, noteValue)
      if (!result.success) {
        setSaveErrors(prev => ({
          ...prev,
          [category]: 'Failed to save your goal. Please try again.',
        }))
      } else {
        // Update saved value and clear input
        setSavedGoalNotes(prev => ({ ...prev, [category]: noteValue }))
        setGoalNotes(prev => ({ ...prev, [category]: '' }))
        setSuccessMessages(prev => ({ ...prev, [category]: true }))
      }
    } catch (error) {
      console.error(`Error saving ${category} goal:`, error)
      setSaveErrors(prev => ({
        ...prev,
        [category]: 'An unexpected error occurred. Please try again.',
      }))
    } finally {
      setSavingStates(prev => ({ ...prev, [category]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8" aria-busy="true" aria-live="polite">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading your goals...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {goalFields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <h3 className="text-lg font-medium mb-2">{label}</h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Input
                  value={goalNotes[key]}
                  onChange={e => handleInputChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full"
                  disabled={savingStates[key]}
                  aria-label={`${label} goal input`}
                />
                <Button
                  onClick={() => handleSaveGoalNote(key)}
                  disabled={savingStates[key] || !goalNotes[key].trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  aria-label={`Save ${label.toLowerCase()} goal`}
                >
                  {savingStates[key] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    `Save ${label}`
                  )}
                </Button>

                {saveErrors[key] && (
                  <div className="text-sm text-destructive" role="alert">
                    {saveErrors[key]}
                  </div>
                )}

                {savedGoalNotes[key] && (
                  <div aria-live="polite">
                    {successMessages[key] && (
                      <div className="flex items-center font-medium text-green-600 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 shrink-0" />
                        Goal saved successfully
                      </div>
                    )}
                    <p className="text-foreground">
                      <span className="font-bold">Current goal:</span> {savedGoalNotes[key]}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
