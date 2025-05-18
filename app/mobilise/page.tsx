'use client'

import { CollapsibleBox } from '@/components/common/collapsible-box'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { MuscleGroupSelector } from '@/components/mobilise'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMobiliseExercises } from '@/hooks'
import type { ExerciseWithLabels } from '@/lib/types'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function MobilisePage() {
  const { allExercises, loading, error, maxMuscleGroup, clearCacheAndReload } =
    useMobiliseExercises()
  const [stretchExercises, setStretchExercises] = useState<ExerciseWithLabels[]>([])
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  useEffect(() => {
    if (selectedNumber === null) {
      setStretchExercises([])
      return
    }

    if (selectedNumber === 0) {
      setStretchExercises(allExercises)
    } else {
      const filtered = allExercises.filter(exercise => {
        // Check body_muscle property first
        const exerciseMuscleId = exercise.body_muscle !== null ? Number(exercise.body_muscle) : null
        if (exerciseMuscleId === selectedNumber) {
          return true
        }

        // Then check name for muscle group indicators
        if (exercise.name) {
          // Look for patterns like "- 5", "(5)", " 5" at the end of the name
          const namePatterns = [
            new RegExp(`- ${selectedNumber}(\\s|$)`),
            new RegExp(`\\(${selectedNumber}\\)`),
            new RegExp(`\\s${selectedNumber}$`),
          ]

          return namePatterns.some(pattern => pattern.test(exercise.name))
        }

        return false
      })

      setStretchExercises(filtered)
    }
  }, [allExercises, selectedNumber])

  const handleSelectNumber = (number: number) => {
    setSelectedNumber(number)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading">Mobilise</h1>
      <CollapsibleBox title="Active" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Only stretch muscles that feel tight during warm up. Remember to stay 'Active' ❤️‍🔥 whilst
            stretching, move in and out of the stretch. This is to stop your body from cooling down
            and to best prepare your body for strengthening.
          </p>
        </div>
      </CollapsibleBox>
      {/* Image section */}
      <section className="mb-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="flex justify-center">
            <Image
              src="https://live.staticflickr.com/65535/54398757288_bca1273e3a_w.jpg"
              alt="Muscles stretching"
              width={400}
              height={600}
              className="w-auto h-auto max-h-[500px] object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Muscle Group Selector Component */}
      <MuscleGroupSelector
        maxMuscleGroup={maxMuscleGroup}
        selectedNumber={selectedNumber}
        onSelectNumber={handleSelectNumber}
      />

      <section>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                <div className="aspect-video"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedNumber === null ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Please select a muscle group from above to view exercises
            </p>

            {/* Previous mobility limitations form */}
            <div className="mt-10 max-w-md mx-auto">
              <h2 className="text-2xl font-heading mb-6">Previous mobility limitations</h2>
              <form className="space-y-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <label htmlFor="mobilityLimitations" className="sr-only">
                      Record stiff muscles and severity
                    </label>
                    <Input
                      id="mobilityLimitations"
                      placeholder="Record stiff muscles and severity (e.g., 'lower back 6/10')"
                      className="w-full"
                      aria-describedby="mobility-limitations-description"
                    />
                    <div id="mobility-limitations-description" className="sr-only">
                      Enter the names of stiff muscles and their severity on a scale of 1-10
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  aria-label="Save mobility limitations"
                >
                  Save
                </Button>
              </form>
            </div>
          </div>
        ) : stretchExercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {stretchExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                linkPrefix="/mobilise"
                showLabels={false}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {selectedNumber !== null && selectedNumber > 0
                  ? `No stretch exercises found for muscle group ${selectedNumber}. Try another group or "All".`
                  : 'No stretch exercises found. Please add some exercises or try selecting "All".'}
              </p>
            </div>

            {/* Helper button */}
            <div className="flex justify-center">
              <button
                onClick={clearCacheAndReload}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                aria-label="Clear local exercise cache and reload the page"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
