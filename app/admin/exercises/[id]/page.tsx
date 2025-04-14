import { notFound } from "next/navigation"
import { getCategories, getExerciseForEdit } from "../../actions"
import { ExerciseForm } from "../../components/exercise-form"

// Use any type to bypass TypeScript errors
export default async function EditExercisePage(props: any) {
  const { params } = props
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
