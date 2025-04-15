import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

export async function GET() {
  try {
    // Directly access the database
    const { data: exercises, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', '268c3c11-5c85-44a5-82f2-88801189ea0b')

    if (error) {
      console.error('Warmup API error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!exercises || exercises.length === 0) {
      return NextResponse.json([])
    }

    // Transform to the expected format
    const formattedExercises: ExerciseWithLabels[] = exercises.map(
      (exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || '30',
        reps: exercise.reps || '4',
        labels: [],
      })
    )

    return NextResponse.json(formattedExercises)
  } catch (error) {
    console.error('Warmup API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warmup exercises' },
      { status: 500 }
    )
  }
}
