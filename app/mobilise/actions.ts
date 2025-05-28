'use server'

import { createClient } from '@supabase/supabase-js'

// Create a server-side Supabase client
const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: true,
    },
  })
}

export async function getUserMobilityLimitations(userId: string): Promise<string> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('mobility_limitations')
      .select('limitations')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If the record doesn't exist, that's expected for new users
      if (error.code === 'PGRST116') {
        return ''
      }
      console.error('Error fetching user mobility limitations:', error)
      return ''
    }

    return data?.limitations || ''
  } catch (error) {
    console.error('Error in getUserMobilityLimitations:', error)
    return ''
  }
}

export async function saveMobilityLimitations(
  userId: string,
  limitations: string
): Promise<{ success: boolean }> {
  try {
    const supabase = createServerClient()

    // Check if the record already exists
    const { data: existingRecord, error: fetchError } = await supabase
      .from('mobility_limitations')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing mobility record:', fetchError)
      return { success: false }
    }

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('mobility_limitations')
        .update({ limitations, updated_at: new Date().toISOString() })
        .eq('id', existingRecord.id)

      if (updateError) {
        console.error('Error updating mobility limitations:', updateError)
        return { success: false }
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from('mobility_limitations').insert({
        user_id: userId,
        limitations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('Error inserting mobility limitations:', insertError)
        return { success: false }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in saveMobilityLimitations:', error)
    return { success: false }
  }
}
