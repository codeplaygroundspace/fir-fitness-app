import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

/**
 * Fetches exercises from Supabase by category ID and formats them consistently
 * @param categoryId UUID of the category to fetch exercises for
 * @param formatImageFn Optional custom image URL formatter
 * @returns Formatted exercises or empty array
 */
export async function fetchExercisesByCategory(
  categoryId: string,
  formatImageFn?: (url: string | null) => string
): Promise<ExerciseWithLabels[]> {
  try {
    // Query the database
    const { data: exercises, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order')

    if (error) {
      console.error(`API error fetching exercises for category ${categoryId}:`, error)
      return []
    }

    if (!exercises || exercises.length === 0) {
      return []
    }

    // Default image formatter
    const defaultImageFormatter = (url: string | null): string =>
      url && (url.startsWith('http') || url.startsWith('/'))
        ? url
        : '/placeholder.svg?height=200&width=300'

    // Use the provided image formatter or the default one
    const imageFormatter = formatImageFn || defaultImageFormatter

    // Transform to the expected format
    return exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      image: imageFormatter(exercise.image_url),
      description: exercise.ex_description || 'No description available',
      video_url: exercise.video_url || null,
      video_url_2: exercise.video_url_2 || null,
      video_url_3: exercise.video_url_3 || null,
      body_muscle: exercise.body_muscle || null,
      labels: [],
    }))
  } catch (error) {
    console.error(`Unexpected error fetching exercises for category ${categoryId}:`, error)
    return []
  }
}
