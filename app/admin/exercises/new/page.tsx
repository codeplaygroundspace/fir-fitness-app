import { getCategories } from "../../actions"
import { ExerciseForm } from "../../components/exercise-form"

export default async function NewExercisePage() {
  const categories = await getCategories()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
      <ExerciseForm categories={categories} />
    </div>
  )
}
