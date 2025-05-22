'use server'

import { supabaseServer } from '@/lib/supabase'
import type { Database } from '@/lib/types'

/**
 * Fetches the user's imbalance image from the database
 * @param userId - The ID of the user whose image to fetch
 * @returns The image URL if found, null otherwise
 */
export async function getUserImbalanceImage(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseServer
      .from('user_imbalance_images')
      .select('image_url')
      .eq('user_id', userId)
      .single()

    if (error) {
      // Log the error but don't expose it to the client
      console.error('Error fetching user imbalance image:', error)

      if (error.code === 'PGRST116') {
        // No image found for this user - this is an expected case
        return null
      }

      throw error
    }

    return data?.image_url || null
  } catch (error) {
    // Log the error but don't expose internal details to the client
    console.error('Error in getUserImbalanceImage:', error)
    return null
  }
}
