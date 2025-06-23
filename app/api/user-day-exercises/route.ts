import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const dayId = searchParams.get('dayId')

    if (!userId || !dayId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId and dayId' },
        { status: 400 }
      )
    }

    // Use Supabase's automatic relationship syntax (now that we have foreign keys)
    const { data: userDayExercises, error } = await supabaseServer
      .from('user_day_exercise')
      .select(
        `
        id,
        day_id,
        exercise_id,
        user_id,
        exercises (
          id,
          name,
          image_url,
          ex_description,
          exercise_group,
          exercise_groups (
            id,
            name,
            image_url,
            body_sec,
            fir_level,
            exercise_body_section (
              name
            ),
            exercise_fir (
              name
            )
          )
        )
      `
      )
      .eq('user_id', userId)
      .eq('day_id', dayId)

    if (error) {
      console.error('Error fetching user day exercises:', error)
      return NextResponse.json({ error: 'Failed to fetch user day exercises' }, { status: 500 })
    }

    // Transform the data to a more usable format
    const transformedData =
      userDayExercises?.map(item => {
        const exercise = item.exercises as any
        const exerciseGroup = exercise?.exercise_groups as any

        return {
          id: item.id,
          day_id: item.day_id,
          exercise_id: item.exercise_id,
          user_id: item.user_id,
          exercise: exercise
            ? {
                id: exercise.id,
                name: exercise.name,
                image_url: exercise.image_url,
                description: exercise.ex_description,
                exercise_group: exercise.exercise_group,
                group: exerciseGroup
                  ? {
                      id: exerciseGroup.id,
                      name: exerciseGroup.name,
                      image_url: exerciseGroup.image_url,
                      body_section: exerciseGroup.body_sec,
                      fir_level: exerciseGroup.fir_level,
                      body_section_name: exerciseGroup.exercise_body_section?.name,
                      fir_level_name: exerciseGroup.exercise_fir?.name,
                    }
                  : null,
              }
            : null,
        }
      }) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
