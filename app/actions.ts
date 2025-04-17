'use server'

import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

// Update the ExerciseGroup type to include category_id
export type ExerciseGroup = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
  body_section_name: string | null
  fit_level: number | null
  fit_level_name: string | null
  category_id?: string | null // Allow null value
}

export async function getWarmupExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the warmup category ID - using ilike for case-insensitive matching
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('categories')
      .select('id, name')
      .ilike('name', '%warmup%')

    if (categoryError) {
      console.error('Error fetching warmup category:', categoryError)
      return []
    }

    if (!categoryData || categoryData.length === 0) {
      // Get all available categories
      const { data: allCategories } = await supabaseServer
        .from('categories')
        .select('id, name')
      
      return []
    }

    // Use the first category that matches
    const warmupCategoryId = categoryData[0].id

    // Now get all exercises in the warmup category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', warmupCategoryId)

    if (exercisesError) {
      console.error('Error fetching warmup exercises:', exercisesError)
      return []
    }

    if (!exercises || exercises.length === 0) {
      // Return placeholder data if no exercises found
      return [
        {
          id: 0,
          name: 'Sample Warmup Exercise',
          image: '/placeholder.svg?height=200&width=300',
          description:
            'This is a placeholder. No actual warmup exercises found in the database.',
          duration: '30',
          reps: '4',
          labels: [],
        },
      ]
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || '30',
        reps: exercise.reps || '4',
        labels: [],
      }
    })
  } catch (error) {
    console.error('Unexpected error in getWarmupExercises:', error)
    return []
  }
}

export async function getStretchExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the stretch category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('categories')
      .select('id, name')
      .ilike('name', '%stretch%')

    if (categoryError) {
      console.error('Error fetching stretch category:', categoryError)
      return []
    }

    if (!categoryData || categoryData.length === 0) {
      // Get all available categories
      const { data: allCategories } = await supabaseServer
        .from('categories')
        .select('id, name')
      
      return []
    }

    // Use the first category that matches
    const stretchCategoryId = categoryData[0].id

    // Now get all exercises in the stretch category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', stretchCategoryId)

    if (exercisesError) {
      console.error('Error fetching stretch exercises:', exercisesError)
      return []
    }

    if (!exercises || exercises.length === 0) {
      // Return placeholder data if no exercises found
      return [
        {
          id: 0,
          name: 'Sample Stretch Exercise',
          image: '/placeholder.svg?height=200&width=300',
          description:
            'This is a placeholder. No actual stretch exercises found in the database.',
          duration: '15-30',
          reps: null,
          labels: [],
        },
      ]
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      // Ensure image_url is properly handled
      let imageUrl = '/placeholder.svg?height=200&width=300'

      if (exercise.image_url) {
        // If it's a valid URL or path, use it
        if (
          exercise.image_url.startsWith('http') ||
          exercise.image_url.startsWith('/')
        ) {
          imageUrl = exercise.image_url
        }
      }

      return {
        id: exercise.id,
        name: exercise.name,
        image: imageUrl,
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || '15-30', // Default duration for stretches
        reps: exercise.reps || null,
        labels: [],
      }
    })
  } catch (error) {
    console.error('Unexpected error in getStretchExercises:', error)
    return []
  }
}

// Update the getFitExercises function to handle the missing exercise_id column

export async function getFitExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, try to get the FIT category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('categories')
      .select('id, name')
      .ilike('name', '%fit%') // Only search for "fit" pattern

    if (categoryError) {
      console.error('Error fetching FIT category:', categoryError)
      return []
    }

    if (!categoryData || categoryData.length === 0) {
      // Get all available categories
      const { data: allCategories } = await supabaseServer
        .from('categories')
        .select('id, name')
      
      return []
    }

    // Use the first category that matches
    const fitCategoryId = categoryData[0].id

    // Now get all exercises in the FIT category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', fitCategoryId)

    if (exercisesError) {
      console.error('Error fetching FIT exercises:', exercisesError)
      return []
    }

    if (!exercises || exercises.length === 0) {
      // Try to get some exercises as fallback
      const { data: fallbackExercises, error: fallbackError } =
        await supabaseServer.from('exercises').select('*').limit(10)

      if (
        fallbackError ||
        !fallbackExercises ||
        fallbackExercises.length === 0
      ) {
        return [
          {
            id: 0,
            name: 'Sample FIT Exercise',
            image: '/placeholder.svg?height=200&width=300',
            description:
              'This is a placeholder. No FIT exercises found in the database.',
            duration: '60',
            reps: null,
            labels: [],
            categories: ['Sample'],
          },
        ]
      }

      // Map exercises to the format we need
      return fallbackExercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }))
    }

    // Map exercises to the format we need
    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }
    })
  } catch (error) {
    console.error('Unexpected error in getFitExercises:', error)
    return []
  }
}

// Update the getExerciseById function to handle the missing exercise_id column

export async function getExerciseById(
  id: number
): Promise<ExerciseWithLabels | undefined> {
  try {
    const { data: exercise, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !exercise) {
      console.error('Error fetching exercise:', error)
      return undefined
    }

    // Skip fetching exercise labels since the column doesn't exist
    // Just use default categories
    return {
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || '/placeholder.svg?height=200&width=300',
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
      categories: getDefaultCategories(exercise.name),
    }
  } catch (error) {
    console.error('Error in getExerciseById:', error)
    return undefined
  }
}

// Helper function to assign default categories based on exercise name
function getDefaultCategories(exerciseName: string): string[] {
  const name = exerciseName.toLowerCase()
  const categories: string[] = []

  // Assign body region
  if (
    name.includes('press') ||
    name.includes('pull') ||
    name.includes('overhead')
  ) {
    categories.push('Upper')
  } else if (
    name.includes('thrust') ||
    name.includes('brace') ||
    name.includes('lateral')
  ) {
    categories.push('Middle')
  } else if (
    name.includes('squat') ||
    name.includes('deadlift') ||
    name.includes('raise')
  ) {
    categories.push('Lower')
  }

  // Assign FIR level (just a default)
  categories.push('FIR: Low')

  return categories
}

// Add a function to get exercises by type (to replace getExercisesByType)
export async function getExercisesByType(
  type: 'warmup' | 'stretch' | 'fit'
): Promise<ExerciseWithLabels[]> {
  try {
    // Map the type to the appropriate category name pattern
    let categoryPattern: string
    switch (type) {
      case 'warmup':
        categoryPattern = '%warmup%'
        break
      case 'stretch':
        categoryPattern = '%stretch%'
        break
      case 'fit':
        categoryPattern = '%fit%'
        break
    }

    // Get the category ID
    const { data: categoryData } = await supabaseServer
      .from('categories')
      .select('id')
      .ilike('name', categoryPattern)

    if (!categoryData || categoryData.length === 0) {
      return []
    }

    const categoryId = categoryData[0].id

    // Get exercises in this category
    const { data: exercises, error } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', categoryId)

    if (error || !exercises) {
      console.error(`Error fetching ${type} exercises:`, error)
      return []
    }

    // Map to the expected format
    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || '/placeholder.svg?height=200&width=300',
      description: exercise.ex_description,
      duration: exercise.duration || null,
      reps: exercise.reps || null,
      labels: [],
      categories: [],
    }))
  } catch (error) {
    console.error(`Error in getExercisesByType for ${type}:`, error)
    return []
  }
}

// Add this new function to fetch exercise groups
export async function getExerciseGroups(): Promise<ExerciseGroup[]> {
  try {
    // Direct SQL approach to ensure we get the proper joins
    const { data, error } = await supabaseServer.rpc('get_exercise_groups_with_details');
    
    if (error) {
      console.error('Error fetching exercise groups with RPC:', error);
      
      // Fallback to regular query with explicit joins
      const { data: fallbackData, error: fallbackError } = await supabaseServer
        .from('exercise_groups')
        .select(`
          id,
          name,
          image_url,
          body_sec,
          fir_level
        `)
        .order('name');
        
      if (fallbackError || !fallbackData) {
        console.error('Error in fallback query:', fallbackError);
        return [];
      }
      
      // Manually get the related data
      const groupIds = fallbackData.map(g => g.id);
      
      // Get the intensity levels
      const { data: intensityData } = await supabaseServer
        .from('exercise_intensity')
        .select('id, name');
        
      // Get the body sections
      const { data: bodySectionData } = await supabaseServer
        .from('exercise_body_section')
        .select('id, body_section');
        
      // Create lookups
      const intensityMap = (intensityData || []).reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<number, string>);
      
      const bodySectionMap = (bodySectionData || []).reduce((acc, item) => {
        acc[item.id] = item.body_section;
        return acc;
      }, {} as Record<number, string>);
      
      // Map the data
      return fallbackData.map(group => {
        const result = {
          id: group.id,
          name: group.name,
          description: null, // No description column in the database
          image_url: group.image_url,
          body_sec: group.body_sec,
          body_section_name: group.body_sec ? bodySectionMap[group.body_sec] || null : null,
          fit_level: group.fir_level,
          fit_level_name: group.fir_level ? intensityMap[group.fir_level] || null : null,
          category_id: null // No category_id column in the database
        };
        
        return result;
      });
    }
    
    // If RPC successful, use that data
    return (data || []).map((group: any) => ({
      id: group.id,
      name: group.name,
      description: null, // No description in our database
      image_url: group.image_url,
      body_sec: group.body_sec,
      body_section_name: group.body_section || null,
      fit_level: group.fir_level,
      fit_level_name: group.intensity_name || null,
      category_id: null // No category_id in our database
    }));
  } catch (error) {
    console.error('Error in getExerciseGroups:', error)
    return []
  }
}

// Update the getExercisesByGroup function to use the exercise_group column
export async function getExercisesByGroup(
  groupId: number
): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the group details to know what we're looking for
    const { data: group, error: groupError } = await supabaseServer
      .from('exercise_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      console.error(`Error fetching group ${groupId}:`, groupError)
      return []
    }

    // Primary approach: Use the exercise_group column (this is the correct column name)
    // We need to convert groupId to string since that's how it's stored in the database
    const { data: exercisesByGroup, error: groupError2 } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('exercise_group', groupId.toString())

    if (!groupError2 && exercisesByGroup && exercisesByGroup.length > 0) {
      // Map to the expected format
      return exercisesByGroup.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description,
        duration: exercise.duration || null,
        reps: exercise.reps || null,
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }))
    }

    // If no exercises found with the exact exercise_group, we'll return an empty array
    // This is what the user wants - only show exercises that match the specific group
    return []
  } catch (error) {
    console.error(`Error in getExercisesByGroup for ${groupId}:`, error)
    return []
  }
}
