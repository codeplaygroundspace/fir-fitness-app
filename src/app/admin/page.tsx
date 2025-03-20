import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabaseServer } from "@/lib/supabase"
import { PlusCircle, Edit } from "lucide-react"
import { DeleteExerciseButton } from "./components/delete-exercise-button"

export default async function AdminPage() {
  const { data: exercises, error } = await supabaseServer.from("exercises").select("*, categories(name)").order("name")

  if (error) {
    console.error("Error fetching exercises:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        <Link href="/admin/exercises/new">
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Exercise
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises?.map((exercise) => (
                <tr key={exercise.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercise.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exercise.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercise.categories?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <Link href={`/admin/exercises/${exercise.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteExerciseButton id={exercise.id} name={exercise.name} />
                    </div>
                  </td>
                </tr>
              ))}

              {exercises?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No exercises found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

