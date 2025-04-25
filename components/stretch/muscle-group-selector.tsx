import React from 'react'
import { cn } from '@/lib/utils'

interface MuscleGroupSelectorProps {
  maxMuscleGroup: number
  selectedNumber: number | null
  onSelectNumber: (number: number) => void
}

export const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({
  maxMuscleGroup,
  selectedNumber,
  onSelectNumber,
}) => {
  // Create an array with numbers 1 through maxMuscleGroup for the buttons
  const muscleGroupButtons = Array.from({ length: maxMuscleGroup }, (_, i) => i + 1)

  return (
    <section className="mb-8">
      <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-1 text-sm mb-2">
        {/* "All" button */}
        <div className="h-10 p-1 relative">
          <button
            onClick={() => onSelectNumber(0)}
            className={cn(
              'h-full w-full flex items-center justify-center rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedNumber === 0 && 'ring-1 ring-primary',
              selectedNumber === 0
                ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                : 'border-2 border-border hover:border-primary/50'
            )}
            aria-label="All muscles"
            aria-pressed={selectedNumber === 0}
          >
            <span className={cn('z-10', selectedNumber === 0 && 'text-primary-foreground')}>
              All
            </span>
          </button>
        </div>

        {/* Numbered buttons */}
        {muscleGroupButtons.map(number => (
          <div key={number} className="h-10 p-1 relative">
            <button
              onClick={() => onSelectNumber(number)}
              className={cn(
                'h-full w-full flex items-center justify-center rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                selectedNumber === number && 'ring-1 ring-primary',
                selectedNumber === number
                  ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-2 border-border hover:border-primary/50'
              )}
              aria-label={`Muscle group ${number}`}
              aria-pressed={selectedNumber === number}
            >
              <span className={cn('z-10', selectedNumber === number && 'text-primary-foreground')}>
                {number}
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
