import { NextResponse } from 'next/server'
import { fetchExercisesByCategory } from '@/lib/api-utils'
import { supabaseServer } from '@/lib/supabase'

// Category IDs for different exercise types
const CATEGORY_IDS = {
  warmup: '268c3c11-5c85-44a5-82f2-88801189ea0b',
  stretch: '4afc93b4-8465-49fd-ab2d-678a3fccd71e',
  workout: '976adc34-76e5-44fd-b5b4-b7ff5117a27d',
}

// Default durations for different exercise types
const DEFAULT_DURATIONS = {
  warmup: '30',
  stretch: '15-30',
  workout: '60',
}

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as 'warmup' | 'stretch' | 'workout' | null
    const group = url.searchParams.get('group')
    const id = url.searchParams.get('id')

    // Handle individual exercise query by ID
    if (id) {
      const exerciseId = parseInt(id, 10)
      if (isNaN(exerciseId)) {
        return NextResponse.json(
          { error: 'Invalid exercise ID. Must be a number.' },
          { status: 400 }
        )
      }

      const { data: exercise, error } = await supabaseServer
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single()

      if (error || !exercise) {
        console.error('Error fetching exercise by ID:', error)
        return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
      }

      // Format the exercise data
      const formattedExercise = {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        video_url: exercise.video_url || null,
        body_muscle: exercise.body_muscle || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }

      return NextResponse.json(formattedExercise)
    }

    // Validate exercise type if provided
    if (type && !['warmup', 'stretch', 'workout'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid exercise type. Must be warmup, stretch, or workout.' },
        { status: 400 }
      )
    }

    // Handle group-based query
    if (group) {
      const groupId = parseInt(group, 10)
      if (isNaN(groupId)) {
        return NextResponse.json({ error: 'Invalid group ID. Must be a number.' }, { status: 400 })
      }

      try {
        // Import directly here to avoid circular dependencies
        const { getExercisesByGroup } = await import('@/app/actions')
        const exercises = await getExercisesByGroup(groupId)

        // Ensure each exercise has categories, especially FIR categories
        const exercisesWithCategories = exercises.map(exercise => {
          if (!exercise.categories || exercise.categories.length === 0) {
            // Add default categories
            return {
              ...exercise,
              categories: getDefaultCategories(exercise.name),
            }
          }

          // Check if there's already a FIR category
          const hasFirCategory = exercise.categories.some(cat => cat.startsWith('FIR:'))

          if (!hasFirCategory) {
            // Add a default FIR category if none exists
            return {
              ...exercise,
              categories: [...exercise.categories, 'FIR: Low'],
            }
          }

          console.log(`Exercise ${exercise.name} has categories:`, exercise.categories)
          return exercise
        })

        return NextResponse.json(exercisesWithCategories)
      } catch (error) {
        console.error('Error fetching exercises by group:', error)
        return NextResponse.json(
          { error: 'Failed to fetch exercises for this group' },
          { status: 500 }
        )
      }
    }

    // Handle type-based query
    if (type) {
      const categoryId = CATEGORY_IDS[type]
      const defaultDuration = DEFAULT_DURATIONS[type]

      let exercises = await fetchExercisesByCategory(categoryId, defaultDuration)

      // Add categories for Workout exercises
      if (type === 'workout') {
        exercises = exercises.map(exercise => ({
          ...exercise,
          categories: getDefaultCategories(exercise.name),
        }))
      }

      return NextResponse.json(exercises)
    }

    // If no specific query, return an error (or could return all exercises)
    return NextResponse.json(
      {
        error: 'Please specify a type (warmup, stretch, workout), group ID, or exercise ID.',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Exercise API error:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}

// Helper function to assign default categories based on exercise name
function getDefaultCategories(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const categories: string[] = []

  // Assign body region
  if (name.includes('press') || name.includes('pull') || name.includes('overhead')) {
    categories.push('Upper')
  } else if (name.includes('thrust') || name.includes('brace') || name.includes('lateral')) {
    categories.push('Middle')
  } else if (name.includes('squat') || name.includes('deadlift') || name.includes('raise')) {
    categories.push('Lower')
  }

  // Assign FIR level (just a default)
  categories.push('FIR: Low')

  console.log(`Default categories for exercise "${exerciseName}":`, categories)
  return categories
}
