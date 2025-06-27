import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const dayId = searchParams.get('dayId')
    const category = searchParams.get('category') || 'strengthen'

    if (!userId || !dayId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId and dayId' },
        { status: 400 }
      )
    }

    // First get the category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('categories')
      .select('id')
      .eq('name', category)
      .single()

    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError)
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('user_day_exercise')
      .select(
        `
        id,
        day_id,
        exercise_id,
        user_id,
        exercises!inner (
          id,
          name,
          image_url,
          ex_description,
          exercise_group,
          kit,
          body_muscle,
          category_id,
          exercise_kit (id, name),
          exercise_groups (
            id,
            name,
            image_url,
            body_sec,
            exercise_body_section (name)
          ),
          body_muscles (id, name, body_section, image_url)
        )
      `
      )
      .eq('user_id', userId)
      .eq('day_id', parseInt(dayId, 10))
      .eq('exercises.category_id', categoryData.id)

    if (error) {
      console.error('Error fetching user day exercises:', error)
      return NextResponse.json({ error: 'Failed to fetch user day exercises' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
