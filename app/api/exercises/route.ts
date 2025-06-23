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

// Default durations for different exercise types
const DEFAULT_DURATIONS = {
  warmup: '30',
  stretch: '15-30',
  workout: '60',
  cooldown: '30',
  'warm-up': '30',
  mobilise: '15-30',
  strengthen: '60',
  recover: '30',
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as keyof typeof CATEGORY_IDS | null
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
        .select(
          `
          *,
          exercise_kit (id, name),
          exercise_groups (
            id, name, image_url, body_sec, fir_level,
            exercise_body_section (name),
            exercise_fir (name)
          ),
          body_muscles (id, name, body_section, image_url)
        `
        )
        .eq('id', exerciseId)
        .single()

      if (error || !exercise) {
        console.error('Error fetching exercise by ID:', error)
        return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
      }

      return NextResponse.json(exercise)
    }

    // Handle group-based query
    if (group) {
      const groupId = parseInt(group, 10)
      if (isNaN(groupId)) {
        return NextResponse.json({ error: 'Invalid group ID. Must be a number.' }, { status: 400 })
      }

      const { getExercisesByGroup } = await import('@/app/actions')
      const exercises = await getExercisesByGroup(groupId)
      return NextResponse.json(exercises)
    }

    // Handle type-based query
    if (type) {
      if (!CATEGORY_IDS[type]) {
        return NextResponse.json(
          {
            error: 'Invalid exercise type. Must be one of: ' + Object.keys(CATEGORY_IDS).join(', '),
          },
          { status: 400 }
        )
      }

      const categoryId = CATEGORY_IDS[type]
      const defaultDuration = DEFAULT_DURATIONS[type]
      const exercises = await fetchExercisesByCategory(categoryId, defaultDuration)
      return NextResponse.json(exercises)
    }

    // If no specific query, return an error
    return NextResponse.json(
      { error: 'Please specify a type, group ID, or exercise ID.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Exercise API error:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}
