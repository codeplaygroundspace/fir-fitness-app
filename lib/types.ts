import type React from 'react'
import type { User, Session } from '@supabase/supabase-js'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Database types
export type Database = {
  public: {
    tables: {
      user_imbalance_images: {
        Row: {
          id: string
          user_id: string
          image_url: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
        }
      }
      exercises: {
        Row: {
          id: number
          name: string
          category_id: string
          created_at: string
          ex_description: string | null
          image_url: string | null
          video_url: string | null
          video_url_2: string | null
          video_url_3: string | null
          kit: string | null
          exercise_group: string | null
          body_muscle: number | null
        }
        Insert: {
          id?: number
          name: string
          category_id: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
          video_url_2?: string | null
          video_url_3?: string | null
          kit?: string | null
          exercise_group?: string | null
          body_muscle?: number | null
        }
        Update: {
          id?: number
          name?: string
          category_id?: string
          created_at?: string
          ex_description?: string | null
          image_url?: string | null
          video_url?: string | null
          video_url_2?: string | null
          video_url_3?: string | null
          kit?: string | null
          exercise_group?: string | null
          body_muscle?: number | null
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
          label_name: string
          label_type: string
        }
        Insert: {
          id?: number
          label_name: string
          label_type: string
        }
        Update: {
          id?: number
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
      user_exercise_notes: {
        Row: {
          id: number
          user_id: string
          exercise_id: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          exercise_id: number
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          exercise_id?: number
          notes?: string
          created_at?: string
          updated_at?: string
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
  type: 'warm-up' | 'mobilise' | 'strengthen' | 'recover'
  instructions?: string
}

// Extended exercise type with labels
export type ExerciseWithLabels = {
  id: number
  name: string
  image: string
  description: string | null
  video_url?: string | null
  video_url_2?: string | null
  video_url_3?: string | null
  body_muscle?: number | null
  labels: {
    label_name: string
    label_type: string
  }[]
  categories?: string[]
}

// Form data for exercises
export type ExerciseFormData = {
  name: string
  description: string | null
  image_url: string | null
  video_url: string | null
  video_url_2: string | null
  video_url_3: string | null
  category_id: string
  labels: string[]
}

// Auth context type
export type AuthContextType = {
  session: Session | null
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  error: string | null
}

// Component props types
export interface ExerciseCardProps {
  id: number
  name: string
  image: string
  linkPrefix: string
}

export interface ExerciseImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
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

export interface CollapsibleBoxProps {
  children: React.ReactNode
  title?: string
  defaultOpen?: boolean
  className?: string
}

export interface WorkoutLoggerProps {
  exerciseId: number
  exerciseName: string
  exerciseType: 'warm-up' | 'mobilise' | 'strengthen' | 'recover'
}

export interface ShareWorkoutProps {
  exerciseId: number
  exerciseName: string
  exerciseType: string
}

export interface BackButtonProps {
  href: string
}

export interface InfoProps {
  children: React.ReactNode
  className?: string
  title?: string | null
}

export interface ConfigErrorProps {
  message: string
}

// Function to get exercises by group
export type GetExercisesByGroupFn = (groupId: number) => Promise<ExerciseWithLabels[]>

export type ExerciseGroup = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  body_sec: number
  category_id?: string
}

export type OfflineWorkoutLog = {
  exercise_id: number
  exercise_name: string
  exercise_type: string
  completed_at: string
  synced: boolean
}
