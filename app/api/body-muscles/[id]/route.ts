import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const muscleId = parseInt(id, 10)

    if (isNaN(muscleId)) {
      return NextResponse.json({ error: 'Invalid muscle ID. Must be a number.' }, { status: 400 })
    }

    const { data: muscle, error } = await supabaseServer
      .from('body_muscles')
      .select('*')
      .eq('id', muscleId)
      .single()

    if (error || !muscle) {
      console.error('Error fetching body muscle:', error)
      return NextResponse.json({ error: 'Body muscle not found' }, { status: 404 })
    }

    return NextResponse.json(muscle)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
