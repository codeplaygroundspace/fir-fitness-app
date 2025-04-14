import { notFound } from "next/navigation"
import { getCategories, getExerciseForEdit } from "../../actions"
import { ExerciseForm } from "../../components/exercise-form"
import type { PageParams } from "@/lib/types"

export default async function EditExercisePage({ params }: PageParams) {
  const id = Number.parseInt(params.id)
  const [exercise, categories] = await Promise.all([getExerciseForEdit(id), getCategories()])

  if (!exercise) {
    return notFound()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Exercise: {exercise.name}</h2>
      <ExerciseForm categories={categories} exercise={exercise} isEdit={true} />
    </div>
  )
}
