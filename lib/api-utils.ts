import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

/**
 * Fetches exercises from Supabase by category ID and formats them consistently
 * @param categoryId UUID of the category to fetch exercises for
 * @param defaultDuration Default duration string if not specified in the exercise
 * @param formatImageFn Optional custom image URL formatter
 * @returns Formatted exercises or empty array
 */
export async function fetchExercisesByCategory(
  categoryId: string,
  defaultDuration?: string,
  formatImageFn?: (url: string | null) => string
): Promise<ExerciseWithLabels[]> {
  try {
    const { data: exercises, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('exercise_category', categoryId)

    if (error) {
      throw error
    }

    if (!exercises) {
      return []
    }

    // Default image formatter
    const defaultImageFormatter = (url: string | null): string =>
      url && (url.startsWith('http') || url.startsWith('/'))
        ? url
        : '/placeholder.svg?height=200&width=300'

    // Use the provided image formatter or the default one
    const imageFormatter = formatImageFn || defaultImageFormatter

    // Transform the data to match our expected format
    return exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      image: imageFormatter(exercise.image_url),
      duration: exercise.duration || defaultDuration || null,
      reps: exercise.reps || null,
      description: exercise.ex_description || null,
      video_url: exercise.video_url || null,
      body_muscle: exercise.body_muscle || null,
      categories: [],
    }))
  } catch (error) {
    // Silently handle API errors
    return []
  }
}
