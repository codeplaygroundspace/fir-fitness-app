import { NextResponse } from "next/server"
import { getExerciseById } from "@/lib/api/exercises"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const exercise = await getExerciseById(params.id)

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
    }

    // Add cache control headers for better performance
    return NextResponse.json(exercise, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error in exercise API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
