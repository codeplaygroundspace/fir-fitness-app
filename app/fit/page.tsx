"use client"

import { useState, useEffect, useMemo } from "react"
import { Shuffle, LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// Update imports for moved components
import { CategoryFilter } from "@/components/exercises/category-filter"
import { Info } from "@/components/common/info"
import { getExerciseGroups, type ExerciseGroup } from "../actions"

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

// Map body section numbers to their names
const BODY_SECTIONS = {
  1: "Upper",
  2: "Lower",
  3: "Middle",
}

export default function FitPage() {
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
        const cachedData = localStorage.getItem("fit-groups")
        const cachedTimestamp = localStorage.getItem("fit-groups-timestamp")

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
          localStorage.setItem("fit-groups", JSON.stringify(groups))
          localStorage.setItem("fit-groups-timestamp", Date.now().toString())
        }
      } catch (error) {
        console.error("Error loading exercise groups:", error)
        setError("Failed to load exercise groups. Please try again later.")

        // If API fails, try to use cached data even if expired
        try {
          const cachedData = localStorage.getItem("fit-groups")
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

  // Define static categories for the filter
  const allCategories = useMemo(() => {
    return ["Upper", "Middle", "Lower", "FIR: High", "FIR: Moderate", "FIR: Low"]
  }, [])

  // Filter exercise groups based on selected categories
  const filteredGroups = useMemo(() => {
    if (selectedFilters.length === 0) {
      return exerciseGroups
    }

    // Check if we have any body region filters
    const bodyFilters = selectedFilters.filter((filter) => ["Upper", "Middle", "Lower"].includes(filter))

    // Check if we have any FIR level filters
    const firFilters = selectedFilters.filter((filter) => filter.startsWith("FIR:"))

    return exerciseGroups.filter((group) => {
      // If we have body filters, check if the group matches any of them
      if (bodyFilters.length > 0) {
        const bodySectionName = BODY_SECTIONS[group.body_sec as keyof typeof BODY_SECTIONS]
        if (!bodyFilters.includes(bodySectionName)) {
          return false
        }
      }

      // For FIR filters, we don't have that data in the groups table yet
      // This is a placeholder for when that data becomes available
      if (firFilters.length > 0) {
        // For now, always return true for FIR filters
        // In the future, we can filter based on FIR level if that data is added
        return true
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

  // Helper function to get body section name
  const getBodySectionName = (bodySec: number): string => {
    return BODY_SECTIONS[bodySec as keyof typeof BODY_SECTIONS] || "Unknown"
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>FIT</h1>

      <Info>
        <p className="text-sm text-muted-foreground">
          Below are 8 Functional Moves, each offering multiple exercise variations. The higher your Functional Imbalance
          Risk (FIR) for each Functional Move, the more effort you should exert when performing that exercise:
        </p>
        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>FIR: High 🔴</strong> = Maximal Relative Effort (Push yourself to the max when doing this exercise)
          </li>
          <li>
            <strong>FIR: Mod</strong> = Moderate Relative Effort
          </li>
          <li>
            <strong>FIR: Low</strong> = Minimal Relative Effort (Don't push too hard - just maintain your current
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
              <Link key={group.id} href={`/fit/group/${group.id}`} className="block h-full">
                <div className="rounded-lg overflow-hidden bg-card shadow-md hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video relative">
                    <img
                      src={group.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={`${group.name} exercises`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-medium text-xl mb-2 text-card-foreground">
                      {group.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </h3>
                    <div className="flex flex-wrap mb-2">
                      <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full inline-block mr-1 mb-1">
                        {getBodySectionName(group.body_sec)}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-muted-foreground">
                No FIT exercise groups found. Please add some groups to get started.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

