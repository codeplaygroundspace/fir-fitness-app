import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/types'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Unauthorized', details: sessionError?.message },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      )
    }

    const { data: imageData, error: imageError } = await supabase
      .from('user_imbalance_images')
      .select('image_url')
      .eq('user_id', session.user.id)
      .single()

    if (imageError) {
      console.error('Error fetching imbalance image:', imageError)
      if (imageError.code === 'PGRST116') {
        // No image found for user
        return NextResponse.json(
          { image_url: null },
          {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
            },
          }
        )
      }
      return NextResponse.json(
        { error: 'Database error', details: imageError.message },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      )
    }

    return NextResponse.json(imageData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  }
}
