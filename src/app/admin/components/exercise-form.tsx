"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createExercise, updateExercise } from "../actions"
import type { Database } from "@/lib/supabase"

type Category = Database["public"]["tables"]["categories"]["Row"]

interface ExerciseFormProps {
  categories: Category[]
  exercise?: any
  isEdit?: boolean
}

export function ExerciseForm({ categories, exercise, isEdit = false }: ExerciseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLabels, setSelectedLabels] = useState<string[]>(exercise?.labels || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Add selected labels to form data
    formData.delete("labels") // Remove any existing labels
    selectedLabels.forEach((label) => {
      formData.append("labels", label)
    })

    try {
      let result
      if (isEdit && exercise?.id) {
        result = await updateExercise(exercise.id, formData)
      } else {
        result = await createExercise(formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={exercise?.name || ""} required />
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              name="category_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={exercise?.category_id || ""}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              defaultValue={exercise?.image_url || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              name="video_url"
              defaultValue={exercise?.video_url || ""}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={exercise?.ex_description || ""} rows={4} />
          </div>

          <div>
            <Label>Body Region</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["Upper", "Middle", "Lower"].map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${label}`}
                    checked={selectedLabels.includes(label)}
                    onCheckedChange={() => toggleLabel(label)}
                  />
                  <label
                    htmlFor={`label-${label}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>FIR Level</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["FIR: Low", "FIR: Moderate", "FIR: High"].map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${label}`}
                    checked={selectedLabels.includes(label)}
                    onCheckedChange={() => toggleLabel(label)}
                  />
                  <label
                    htmlFor={`label-${label}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label.replace("FIR: ", "")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Update Exercise" : "Create Exercise"}
        </Button>
      </div>
    </form>
  )
}

