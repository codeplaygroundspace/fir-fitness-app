"use client"

import { Info } from "@/components/common/info"
import { CategoryFilter } from "@/components/exercises/category-filter"
import { ExerciseCard } from "@/components/exercises/exercise-card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, LayoutList, Shuffle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { getExerciseGroups, type ExerciseGroup } from "../actions"

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

// Map Workout level names to display names
const WORKOUT_LEVELS = {
  "high": "Workout: High",
  "moderate": "Workout: Moderate",
  "low": "Workout: Low",
  "very high": "Workout: Very High"
}

export default function WorkoutPage() {
  const [exerciseGroups, setExerciseGroups] = useState<ExerciseGroup[]>([])
  const [loading, setIsLoading] = useState(true)
  const [isSingleColumn, setIsSingleColumn] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExerciseGroups() {
      setIsLoading(true)
      try {
        // Check localStorage first
        const cachedData = localStorage.getItem("workout-groups")
        const cachedTimestamp = localStorage.getItem("workout-groups-timestamp")

        // If we have cached data and it's not expired
        if (cachedData && cachedTimestamp) {
          const timestamp = Number.parseInt(cachedTimestamp, 10)
          const now = Date.now()

          // Use cached data if it's less than 24 hours old
          if (now - timestamp < CACHE_EXPIRATION) {
            const groups = JSON.parse(cachedData)
            setExerciseGroups(groups)
            setIsLoading(false)
            return
          }
        }

        // If no cache or expired, fetch from API
        const groups = await getExerciseGroups()

        if (!groups || groups.length === 0) {
          setError("No exercise groups found. Please check your database configuration.")
        } else {
          setExerciseGroups(groups)
          // Save to localStorage with timestamp
          localStorage.setItem("workout-groups", JSON.stringify(groups))
          localStorage.setItem("workout-groups-timestamp", Date.now().toString())
        }
      } catch (error) {
        console.error("Error loading exercise groups:", error)
        setError("Failed to load exercise groups. Please try again later.")

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem("workout-groups")
          if (cachedData) {
            setExerciseGroups(JSON.parse(cachedData))
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadExerciseGroups()
  }, [])

  // Get unique body section names from exercise groups
  const availableBodySections = useMemo(() => {
    const sections = new Set<string>()
    
    exerciseGroups.forEach(group => {
      if (group.body_section_name) {
        const sectionName = group.body_section_name.charAt(0).toUpperCase() + group.body_section_name.slice(1)
        sections.add(sectionName)
      }
    })
    
    return Array.from(sections)
  }, [exerciseGroups])
  
  // Get unique Workout levels from exercise groups
  const availableWorkoutLevels = useMemo(() => {
    const levels = new Set<string>()
    
    exerciseGroups.forEach(group => {
      if (group.fit_level_name) {
        const displayName = WORKOUT_LEVELS[group.fit_level_name as keyof typeof WORKOUT_LEVELS] || 
          `Workout: ${group.fit_level_name.charAt(0).toUpperCase() + group.fit_level_name.slice(1)}`;
        levels.add(displayName);
      }
    })
    
    const result = Array.from(levels);
    return result;
  }, [exerciseGroups])

  // Define categories for the filter including dynamic body sections and Workout levels
  const allCategories = useMemo(() => {
    // Use body sections from the database, or fall back to static options
    const bodyCategories = availableBodySections.length > 0
      ? availableBodySections
      : ["Upper", "Middle", "Lower"]
    
    // Use Workout levels from the database, or fall back to static options
    const workoutCategories = availableWorkoutLevels.length > 0 
      ? availableWorkoutLevels
      : ["Workout: High", "Workout: Moderate", "Workout: Low", "Workout: Very High"]
    
    const result = [...bodyCategories, ...workoutCategories];
    
    return result;
  }, [availableBodySections, availableWorkoutLevels])

  // Filter exercise groups based on selected categories
  const filteredGroups = useMemo(() => {
    if (selectedFilters.length === 0) {
      return exerciseGroups
    }

    // Check if we have any body region filters
    const bodyFilters = selectedFilters.filter((filter) => !filter.startsWith("Workout:"))

    // Check if we have any Workout level filters
    const workoutFilters = selectedFilters.filter((filter) => filter.startsWith("Workout:"))

    return exerciseGroups.filter((group) => {
      // If we have body filters, check if the group matches any of them
      if (bodyFilters.length > 0) {
        if (!group.body_section_name) return false
        
        const bodySectionName = group.body_section_name.charAt(0).toUpperCase() + group.body_section_name.slice(1)
        if (!bodyFilters.includes(bodySectionName)) {
          return false
        }
      }

      // If we have Workout filters, check if the group matches any of them
      if (workoutFilters.length > 0) {
        if (!group.fit_level_name) return false
        
        const groupWorkoutDisplay = WORKOUT_LEVELS[group.fit_level_name as keyof typeof WORKOUT_LEVELS] || 
          `Workout: ${group.fit_level_name.charAt(0).toUpperCase() + group.fit_level_name.slice(1)}`
        
        if (!workoutFilters.includes(groupWorkoutDisplay)) {
          return false
        }
      }

      return true
    })
  }, [exerciseGroups, selectedFilters])

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters)
  }

  const shuffleGroups = () => {
    setExerciseGroups((prevGroups) => {
      // Create a copy of the array
      const shuffled = [...prevGroups]

      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      return shuffled
    })
  }

  const toggleLayout = () => {
    setIsSingleColumn(!isSingleColumn)
  }

  // Helper function to get capitalized body section name
  const getBodySectionName = (group: ExerciseGroup): string => {
    if (!group.body_section_name) return "Unknown"
    return group.body_section_name.charAt(0).toUpperCase() + group.body_section_name.slice(1)
  }

  // Helper function to get Workout level display name
  const getWorkoutLevelName = (fitLevel: string | null): string => {
    if (!fitLevel) return "Unknown"
    
    // Check if it's in our mapping
    if (WORKOUT_LEVELS[fitLevel as keyof typeof WORKOUT_LEVELS]) {
      return WORKOUT_LEVELS[fitLevel as keyof typeof WORKOUT_LEVELS];
    }
    
    // Otherwise, create a properly formatted name with Workout: prefix
    return `Workout: ${fitLevel.charAt(0).toUpperCase() + fitLevel.slice(1)}`;
  }

  // Create categories for each group
  const getGroupCategories = (group: ExerciseGroup): string[] => {
    const categories: string[] = []
    
    if (group.body_section_name) {
      categories.push(getBodySectionName(group))
    }
    
    if (group.fit_level_name) {
      categories.push(getWorkoutLevelName(group.fit_level_name))
    }
    
    return categories
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Workout</h1>

      <Info>
        <p className="text-sm text-muted-foreground">
          Below are 8 Functional Moves, each offering multiple exercise variations. The higher your Functional Imbalance
          Target (Workout) for each Functional Move, the more effort you should exert when performing that exercise:
        </p>
        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>Workout: Very High 🔴</strong> = Maximum Intensity Effort (Push beyond your limits for this exercise)
          </li>
          <li>
            <strong>Workout: High 🔴</strong> = High Relative Effort (Push yourself to the max when doing this exercise)
          </li>
          <li>
            <strong>Workout: Mod</strong> = Moderate Relative Effort
          </li>
          <li>
            <strong>Workout: Low</strong> = Minimal Relative Effort (Don't push too hard - just maintain your current
            strength)
          </li>
        </ul>
      </Info>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter by Category</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleLayout} className="flex items-center gap-1">
              {isSingleColumn ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
              {isSingleColumn ? "Grid" : "List"}
            </Button>
            <Button variant="outline" size="sm" onClick={shuffleGroups} className="flex items-center gap-1">
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        <CategoryFilter categories={allCategories} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden h-full bg-muted animate-pulse">
                <div className="aspect-video"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className={`grid ${isSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            {filteredGroups.map((group) => (
              <ExerciseCard
                key={group.id}
                id={group.id}
                name={group.name}
                image={group.image_url || "/placeholder.svg?height=200&width=300"}
                linkPrefix="/workout/group"
                categories={getGroupCategories(group)}
                showCategories={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-muted-foreground">
                No Workout exercise groups found. Please add some groups to get started.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
