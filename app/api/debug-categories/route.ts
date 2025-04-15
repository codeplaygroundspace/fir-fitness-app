import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabaseServer
      .from('categories')
      .select('*')

    if (categoriesError) {
      return NextResponse.json(
        { error: 'Error fetching categories', details: categoriesError },
        { status: 500 }
      )
    }

    // Try fetching a few records from exercises table
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .limit(5)

    return NextResponse.json({
      categories,
      exercises: exercises || [],
      categoriesError: categoriesError || null,
      exercisesError: exercisesError || null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error', details: error },
      { status: 500 }
    )
  }
}
