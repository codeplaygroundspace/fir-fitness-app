import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface MuscleGroupSelectorProps {
  maxMuscleGroup: number
  selectedNumbers: number[]
  onToggleNumber: (number: number) => void
}

export const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({
  maxMuscleGroup,
  selectedNumbers,
  onToggleNumber,
}) => {
  // Create an array with numbers 1 through maxMuscleGroup for the buttons
  const muscleGroupButtons = useMemo(
    () => Array.from({ length: maxMuscleGroup }, (_, i) => i + 1),
    [maxMuscleGroup]
  )

  return (
    <section className="mb-8">
      <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-1 text-sm mb-2">
        {/* Numbered buttons */}
        {muscleGroupButtons.map(number => {
          const isSelected = selectedNumbers.includes(number)
          return (
            <div key={`muscle-group-${number}`} className="h-10 p-1 relative">
              <button
                onClick={() => onToggleNumber(number)}
                className={cn(
                  'h-full w-full flex items-center justify-center rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isSelected && 'ring-1 ring-primary',
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-2 border-border hover:border-primary/50'
                )}
                aria-label={`Muscle group ${number}`}
                aria-pressed={isSelected}
              >
                <span className={cn('z-10', isSelected && 'text-primary-foreground')}>
                  {number}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
