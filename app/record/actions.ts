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

export interface GoalNote {
  goal_category_id: number
  notes: string
  created_at: string
  updated_at: string
}

export interface GoalNotes {
  pain: string
  posture: string
  performance: string
  physique: string
}

export interface WorkoutDay {
  user_id: string
  date: string
  completed: boolean
}

// Get user's goal notes for all categories
export async function getUserGoalNotes(userId: string): Promise<GoalNotes> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('user_goal_notes')
      .select('goal_category_id, notes')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user goal notes:', error)
      return { pain: '', posture: '', performance: '', physique: '' }
    }

    // Convert array to object with category names
    const goalNotes: GoalNotes = { pain: '', posture: '', performance: '', physique: '' }

    data?.forEach(note => {
      switch (note.goal_category_id) {
        case 1:
          goalNotes.pain = note.notes || ''
          break
        case 2:
          goalNotes.posture = note.notes || ''
          break
        case 3:
          goalNotes.performance = note.notes || ''
          break
        case 4:
          goalNotes.physique = note.notes || ''
          break
      }
    })

    return goalNotes
  } catch (error) {
    console.error('Error in getUserGoalNotes:', error)
    return { pain: '', posture: '', performance: '', physique: '' }
  }
}

// Save or update a goal note for a specific category
export async function saveGoalNote(
  userId: string,
  category: 'pain' | 'posture' | 'performance' | 'physique',
  notes: string
): Promise<{ success: boolean }> {
  try {
    const supabase = createServerClient()

    // Map category names to IDs
    const categoryIds = { pain: 1, posture: 2, performance: 3, physique: 4 }
    const goalCategoryId = categoryIds[category]

    // Use upsert to insert or update
    const { error } = await supabase.from('user_goal_notes').upsert(
      {
        user_id: userId,
        goal_category_id: goalCategoryId,
        notes,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,goal_category_id',
      }
    )

    if (error) {
      console.error('Error saving goal note:', error)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in saveGoalNote:', error)
    return { success: false }
  }
}

// Get user's workout days
export async function getUserWorkouts(userId: string): Promise<WorkoutDay[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('workout_days')
      .select('user_id, date, completed')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching user workouts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserWorkouts:', error)
    return []
  }
}

// Toggle workout day completion
export async function toggleWorkoutDay(
  userId: string,
  date: string,
  completed: boolean
): Promise<{ success: boolean }> {
  try {
    const supabase = createServerClient()

    // Use upsert to insert or update
    const { error } = await supabase.from('workout_days').upsert(
      {
        user_id: userId,
        date,
        completed,
      },
      {
        onConflict: 'user_id,date',
      }
    )

    if (error) {
      console.error('Error toggling workout day:', error)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in toggleWorkoutDay:', error)
    return { success: false }
  }
}
