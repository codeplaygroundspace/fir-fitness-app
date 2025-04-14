import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabaseServer } from "@/lib/supabase"
import { PlusCircle, Edit } from "lucide-react"
import { DeleteExerciseButton } from "./components/delete-exercise-button"

// Add a button to create categories if none exist

export default async function AdminPage() {
  const { data: exercises, error } = await supabaseServer.from("exercises").select("*, categories(name)").order("name")
  const { data: categories } = await supabaseServer.from("categories").select("*")

  if (error) {
    console.error("Error fetching exercises:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        <div className="flex gap-2">
          <Link href="/admin/exercises/new">
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Exercise
            </Button>
          </Link>
        </div>
      </div>

      {/* Show warning if no categories exist */}
      {(!categories || categories.length === 0) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-4">
          <h3 className="font-semibold mb-2">No Categories Found</h3>
          <p className="mb-2">
            You need to create categories before adding exercises. At minimum, create these categories:
          </p>
          <ul className="list-disc pl-5 mb-2">
            <li>Warmup</li>
            <li>Stretch</li>
            <li>FIR</li>
          </ul>
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              Manage Categories
            </Button>
          </Link>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {exercises?.map((exercise) => (
                <tr key={exercise.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{exercise.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{exercise.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {exercise.categories?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
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
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
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
