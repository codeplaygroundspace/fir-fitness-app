import type React from 'react'
import type { User, Session } from '@supabase/supabase-js'

// Database types
export type Database = {
  public: {
    tables: {
      exercises: {
        Row: {
          id: number
          name: string
          category_id: string
          created_at: string
          ex_description: string | null
          image_url: string | null
          video_url: string | null
          duration: string | null
          reps: string | null
          kit: string | null
          exercise_group: string | null // Add this field
        }
        Insert: {
          id?: number
          name: string
          category_id: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
          duration?: string | null
          reps?: string | null
          kit?: string | null
          exercise_group?: string | null // Add this field
        }
        Update: {
          id?: number
          name?: string
          category_id?: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
          duration?: string | null
          reps?: string | null
          kit?: string | null
          exercise_group?: string | null // Add this field
        }
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      exercise_labels: {
        Row: {
          id: number
          // Remove or rename exercise_id based on actual schema
          // exercise_id: number | null
          label_name: string
          label_type: string
        }
        Insert: {
          id?: number
          // Remove or rename exercise_id based on actual schema
          // exercise_id?: number | null
          label_name: string
          label_type: string
        }
        Update: {
          id?: number
          // Remove or rename exercise_id based on actual schema
          // exercise_id?: number | null
          label_name?: string
          label_type?: string
        }
      }
      workout_logs: {
        Row: {
          id: number
          user_id: string
          exercise_id: number
          exercise_name: string
          exercise_type: string
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          exercise_id: number
          exercise_name: string
          exercise_type: string
          completed_at: string
        }
        Update: {
          id?: number
          user_id?: string
          exercise_id?: number
          exercise_name?: string
          exercise_type?: string
          completed_at?: string
        }
      }
      workout_days: {
        Row: {
          id: number
          user_id: string
          date: string
          completed: boolean
        }
        Insert: {
          id?: number
          user_id: string
          date: string
          completed: boolean
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          completed?: boolean
        }
      }
    }
  }
}

// Basic exercise type
export type Exercise = {
  id: number
  name: string
  image: string
  duration?: string
  type: 'warmup' | 'stretch' | 'fit'
  instructions?: string
}

// Extended exercise type with labels
export type ExerciseWithLabels = {
  id: number
  name: string
  image: string
  description: string | null
  duration: string | null
  reps: string | null
  video_url?: string | null
  labels: {
    label_name: string
    label_type: string
  }[]
  categories?: string[]
}

// Form data for exercise admin
export type ExerciseFormData = {
  name: string
  description: string | null
  image_url: string | null
  video_url: string | null
  category_id: string
  labels: string[]
}

// Workout tracking
export type WorkoutDay = {
  id?: number
  user_id: string
  date: string
  completed: boolean
}

// Offline workout log
export type OfflineWorkoutLog = {
  exercise_id: number
  exercise_name: string
  exercise_type: string
  completed_at: string
  synced: boolean
}

// Auth context type
export type AuthContextType = {
  session: Session | null
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  error: string | null
}

// Workout context type
export type WorkoutContextType = {
  workoutDays: WorkoutDay[]
  toggleWorkoutDay: (date: string) => void
  isWorkoutCompleted: (date: string) => boolean
  isLoading: boolean
  error: string | null
}

// Component props types
export interface ExerciseCardProps {
  id: number
  name: string
  image: string
  linkPrefix: string
  duration?: string | null
  reps?: string | null
  categories?: string[]
  showLabels?: boolean
  showCategories?: boolean
}

export interface ExerciseImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export interface ExerciseTimerProps {
  duration: string | number
  onComplete?: () => void
}

export interface DurationLabelProps {
  duration: string
  className?: string
  icon?: React.ReactNode
}

export interface RepsLabelProps {
  reps: string | number
  className?: string
  icon?: React.ReactNode
}

export interface CategoryLabelProps {
  category: string
  className?: string
}

export interface ExerciseFiltersProps {
  categories: string[]
  onFilterChange: (selectedCategories: string[]) => void
}

export interface BodySectionFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

export interface FIRFilterProps {
  categories: string[]
  selectedCategories: string[]
  onFilterChange: (selected: string[]) => void
}

export interface InstructionsBoxProps {
  description: string | null
  fallback?: string
}

export interface WorkoutLoggerProps {
  exerciseId: number
  exerciseName: string
  exerciseType: 'warmup' | 'stretch' | 'fit'
}

export interface ShareWorkoutProps {
  exerciseId: number
  exerciseName: string
  exerciseType: string
}

export interface DeleteExerciseButtonProps {
  id: number
  name: string
}

export interface BackButtonProps {
  href: string
}

export interface InfoProps {
  children: React.ReactNode
  className?: string
}

export interface ConfigErrorProps {
  message: string
}

// Function to get exercises by group
export type GetExercisesByGroupFn = (
  groupId: number
) => Promise<ExerciseWithLabels[]>

export type ExerciseGroup = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
  category_id?: string // Add this field as optional
}
