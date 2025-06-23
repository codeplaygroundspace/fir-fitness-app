import { NextResponse } from 'next/server'
import { fetchExercisesByCategory } from '@/lib/api-utils'
import { supabaseServer } from '@/lib/supabase'

// Category IDs for different exercise types
const CATEGORY_IDS = {
  // Old names (for backward compatibility)
  warmup: '268c3c11-5c85-44a5-82f2-88801189ea0b',
  stretch: '4afc93b4-8465-49fd-ab2d-678a3fccd71e',
  workout: '976adc34-76e5-44fd-b5b4-b7ff5117a27d',
  cooldown: '976adc34-76e5-44fd-b5b4-b7ff5117a27d',

  // New names
  'warm-up': '268c3c11-5c85-44a5-82f2-88801189ea0b',
  mobilise: '4afc93b4-8465-49fd-ab2d-678a3fccd71e',
  strengthen: '976adc34-76e5-44fd-b5b4-b7ff5117a27d',
  recover: '976adc34-76e5-44fd-b5b4-b7ff5117a27d',
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as
      | 'warm-up'
      | 'mobilise'
      | 'strengthen'
      | 'recover'
      | 'warmup'
      | 'stretch'
      | 'workout'
      | 'cooldown'
      | null
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

      // Format the exercise data to match ExerciseWithLabels type
      const formattedExercise = {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=500&width=800',
        description: exercise.ex_description || 'No description available',
        video_url: exercise.video_url || null,
        video_url_2: exercise.video_url_2 || null,
        video_url_3: exercise.video_url_3 || null,
        body_muscle: exercise.body_muscle || null,
        labels: [],
        categories: [], // No longer using categories
      }

      return NextResponse.json(formattedExercise)
    }

    // Validate exercise type if provided
    if (type && !Object.keys(CATEGORY_IDS).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid exercise type. Must be one of: ' + Object.keys(CATEGORY_IDS).join(', ') },
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

        // Return exercises without categories
        return NextResponse.json(exercises)
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

      let exercises = await fetchExercisesByCategory(categoryId)

      // Categories are no longer used for exercises

      return NextResponse.json(exercises)
    }

    // If no specific query, return an error (or could return all exercises)
    return NextResponse.json(
      {
        error: 'Please specify a type, group ID, or exercise ID.',
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
  // Categories are no longer used - return empty array
  return []
}
