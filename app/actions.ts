'use server'

import { supabaseServer } from '@/lib/supabase'
import type { ExerciseWithLabels } from '@/lib/types'

// Update the ExerciseGroup type to remove fir_level references
export type ExerciseGroup = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
  body_section_name: string | null
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
      const { data: allCategories } = await supabaseServer.from('categories').select('id, name')

      return []
    }

    // Use the first category that matches
    const warmupCategoryId = categoryData[0].id

    // Now get all exercises in the warmup category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', warmupCategoryId)
      .order('sort_order')

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
          description: 'This is a placeholder. No actual warmup exercises found in the database.',
          labels: [],
        },
      ]
    }

    // Map exercises to the format we need
    return exercises.map(exercise => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
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
      const { data: allCategories } = await supabaseServer.from('categories').select('id, name')

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
          description: 'This is a placeholder. No actual stretch exercises found in the database.',
          labels: [],
        },
      ]
    }

    // Map exercises to the format we need
    return exercises.map(exercise => {
      // Ensure image_url is properly handled
      let imageUrl = '/placeholder.svg?height=200&width=300'

      if (exercise.image_url) {
        // If it's a valid URL or path, use it
        if (exercise.image_url.startsWith('http') || exercise.image_url.startsWith('/')) {
          imageUrl = exercise.image_url
        }
      }

      return {
        id: exercise.id,
        name: exercise.name,
        image: imageUrl,
        description: exercise.ex_description || 'No description available',
        labels: [],
      }
    })
  } catch (error) {
    console.error('Unexpected error in getStretchExercises:', error)
    return []
  }
}

// Update the getFitExercises function to handle the missing exercise_id column

export async function getWorkoutExercises(): Promise<ExerciseWithLabels[]> {
  try {
    // First, try to get the Workout category ID
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('categories')
      .select('id, name')
      .ilike('name', '%workout%') // Search for "workout" pattern

    if (categoryError) {
      console.error('Error fetching Workout category:', categoryError)
      return []
    }

    if (!categoryData || categoryData.length === 0) {
      // Get all available categories
      const { data: allCategories } = await supabaseServer.from('categories').select('id, name')

      return []
    }

    // Use the first category that matches
    const workoutCategoryId = categoryData[0].id

    // Now get all exercises in the Workout category
    const { data: exercises, error: exercisesError } = await supabaseServer
      .from('exercises')
      .select('*')
      .eq('category_id', workoutCategoryId)

    if (exercisesError) {
      console.error('Error fetching Workout exercises:', exercisesError)
      return []
    }

    if (!exercises || exercises.length === 0) {
      // Try to get some exercises as fallback
      const { data: fallbackExercises, error: fallbackError } = await supabaseServer
        .from('exercises')
        .select('*')
        .limit(10)

      if (fallbackError || !fallbackExercises || fallbackExercises.length === 0) {
        return [
          {
            id: 0,
            name: 'Sample Workout Exercise',
            image: '/placeholder.svg?height=200&width=300',
            description: 'This is a placeholder. No Workout exercises found in the database.',
            labels: [],
            categories: ['Sample'],
          },
        ]
      }

      // Map exercises to the format we need
      return fallbackExercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }))
    }

    // Map exercises to the format we need
    return exercises.map(exercise => {
      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description || 'No description available',
        labels: [],
        categories: getDefaultCategories(exercise.name),
      }
    })
  } catch (error) {
    console.error('Unexpected error in getWorkoutExercises:', error)
    return []
  }
}

// Update the getExerciseById function to handle the missing exercise_id column

export async function getExerciseById(id: number): Promise<ExerciseWithLabels | undefined> {
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
  // Categories are no longer used - return empty array
  return []
}

// Add a function to get exercises by type (to replace getExercisesByType)
export async function getExercisesByType(
  type: 'warmup' | 'stretch' | 'workout'
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
      case 'workout':
        categoryPattern = '%workout%'
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
    return exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image_url || '/placeholder.svg?height=200&width=300',
      description: exercise.ex_description,
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
    // Use a single query with proper join to get all data at once
    const { data, error } = await supabaseServer
      .from('exercise_groups')
      .select(
        `
        id,
        name,
        image_url,
        body_sec,
        exercise_body_section!inner(name)
      `
      )
      .order('name')

    if (error) {
      console.error('Error fetching exercise groups:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Map the data with proper typing
    return data.map((group: any) => ({
      id: group.id,
      name: group.name,
      description: null, // No description column in the database
      image_url: group.image_url,
      body_sec: group.body_sec,
      body_section_name: group.exercise_body_section?.name
        ? group.exercise_body_section.name.charAt(0).toUpperCase() +
          group.exercise_body_section.name.slice(1)
        : null,
      category_id: null, // No category_id column in the database
    }))
  } catch (error) {
    console.error('Error in getExerciseGroups:', error)
    return []
  }
}

// Update the getExercisesByGroup function to use the exercise_group column
export async function getExercisesByGroup(groupId: number, categoryName?: string): Promise<ExerciseWithLabels[]> {
  try {
    // First, get the group details with a simpler query
    const { data: group, error: groupError } = await supabaseServer
      .from('exercise_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (groupError || !group) {
      console.error(`Error fetching group ${groupId}:`, groupError)
      return []
    }

    // Build the query
    let query = supabaseServer
      .from('exercises')
      .select('*, categories!inner(id, name)')
      .eq('exercise_group', groupId)
    
    // If category is specified, filter by it
    if (categoryName) {
      query = query.eq('categories.name', categoryName)
    }

    // Query exercises with exercise_group = groupId (as number)
    const { data: exercisesByGroup, error: groupError2 } = await query.order('sort_order')

    if (groupError2) {
      console.error('Query error:', groupError2)
      return []
    }

    if (!exercisesByGroup || exercisesByGroup.length === 0) {
      return []
    }

    // Get body section data separately
    let bodySection = null

    // Get body section if available
    if (group.body_sec) {
      const { data: bodySectionData } = await supabaseServer
        .from('exercise_body_section')
        .select('name')
        .eq('id', group.body_sec)
        .single()

      if (bodySectionData) {
        bodySection = bodySectionData.name
      }
    }

    // Map to the expected format
    return exercisesByGroup.map(exercise => {
      // Build categories list - no longer used
      const categories: string[] = []

      return {
        id: exercise.id,
        name: exercise.name,
        image: exercise.image_url || '/placeholder.svg?height=200&width=300',
        description: exercise.ex_description,
        labels: [],
        categories: categories,
      }
    })
  } catch (error) {
    console.error(`Error in getExercisesByGroup for ${groupId}:`, error)
    return []
  }
}

// Add this new function to fetch body sections from the database
export async function getBodySections(): Promise<string[]> {
  try {
    const { data, error } = await supabaseServer
      .from('exercise_body_section')
      .select('name')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching body sections:', error)
      return ['upper', 'lower', 'middle'] // Fallback order
    }

    if (!data || data.length === 0) {
      return ['upper', 'lower', 'middle'] // Fallback order if no data
    }

    // Extract the name values and capitalize them
    return data.map(item => item.name.charAt(0).toUpperCase() + item.name.slice(1))
  } catch (error) {
    console.error('Error in getBodySections:', error)
    return ['Upper', 'Lower', 'Middle'] // Fallback order if error
  }
}
