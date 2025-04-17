import { notFound } from "next/navigation"
import { getCategories, getExerciseForEdit } from "../../actions"
import { ExerciseForm } from "../../components/exercise-form"
import { capitalizeFirstLetter } from "@/lib/text-utils"

export default async function EditExercisePage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const [exercise, categories] = await Promise.all([getExerciseForEdit(id), getCategories()])

  if (!exercise) {
    return notFound()
  }

  const displayName = capitalizeFirstLetter(exercise.name)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Exercise: {displayName}</h2>
      <ExerciseForm categories={categories} exercise={exercise} isEdit={true} />
    </div>
  )
}
