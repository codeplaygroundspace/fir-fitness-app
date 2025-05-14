import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET() {
  try {
    // Test direct database access to all categories
    const categories = await supabaseServer.from('categories').select('*')

    // Fetch warm-up exercises directly from database
    const warmupExercises = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', '268c3c11-5c85-44a5-82f2-88801189ea0b')

    // Fetch mobilise exercises directly from database
    const mobiliseExercises = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', '4afc93b4-8465-49fd-ab2d-678a3fccd71e')

    // Fetch strengthen exercises directly from database
    const strengthenExercises = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', '976adc34-76e5-44fd-b5b4-b7ff5117a27d')

    return NextResponse.json({
      categories: categories.data,
      'warm-up': {
        count: warmupExercises.data?.length || 0,
        error: warmupExercises.error,
        data: warmupExercises.data?.slice(0, 3), // Just return first 3 for brevity
      },
      mobilise: {
        count: mobiliseExercises.data?.length || 0,
        error: mobiliseExercises.error,
        data: mobiliseExercises.data?.slice(0, 3), // Just return first 3 for brevity
      },
      strengthen: {
        count: strengthenExercises.data?.length || 0,
        error: strengthenExercises.error,
        data: strengthenExercises.data?.slice(0, 3), // Just return first 3 for brevity
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 })
  }
}
