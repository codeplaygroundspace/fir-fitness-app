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

/**
 * Fetches the user's assigned training days from the database
 * @param userId - The ID of the user whose training days to fetch
 * @returns Array of day numbers assigned to the user
 */
/**
 * Fetches the image URL for a specific training day
 * @param dayId - The day number (1-7)
 * @returns The image URL if found, null otherwise
 */
export async function getDayImage(dayId: number, userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseServer
      .from('user_day_assignments')
      .select('image_url')
      .eq('day_id', dayId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching day image:', error)
      return null
    }

    return data?.image_url || null
  } catch (error) {
    console.error('Error in getDayImage:', error)
    return null
  }
}

export async function getUserTrainingDays(userId: string): Promise<number[]> {
  try {
    const { data, error } = await supabaseServer
      .from('user_day_assignments')
      .select('day_id')
      .eq('user_id', userId)
      .order('day_id')

    if (error) {
      console.error('Error fetching user training days:', error)
      throw error
    }

    return data ? data.map(d => d.day_id) : []
  } catch (error) {
    console.error('Error in getUserTrainingDays:', error)
    return []
  }
}
