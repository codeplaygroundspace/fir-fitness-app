import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

export async function GET() {
  try {
    // Directly access the database
    const { data: exercises, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', '4afc93b4-8465-49fd-ab2d-678a3fccd71e')

    if (error) {
      console.error('Stretch API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!exercises || exercises.length === 0) {
      return NextResponse.json([])
    }

    // Transform to the expected format
    const formattedExercises: ExerciseWithLabels[] = exercises.map(
      (exercise) => {
        // Ensure image_url is properly handled
        let imageUrl = '/placeholder.svg?height=200&width=300'

        if (exercise.image_url) {
          // If it's a valid URL or path, use it
          if (
            exercise.image_url.startsWith('http') ||
            exercise.image_url.startsWith('/')
          ) {
            imageUrl = exercise.image_url
          }
        }

        return {
          id: exercise.id,
          name: exercise.name,
          image: imageUrl,
          description: exercise.ex_description || 'No description available',
          duration: exercise.duration || '15-30',
          reps: exercise.reps || null,
          labels: [],
        }
      }
    )

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error('Stretch API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stretch exercises' },
      { status: 500 }
    )
  }
}
