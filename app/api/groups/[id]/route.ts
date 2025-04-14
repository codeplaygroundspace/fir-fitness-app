import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// Add proper type definition
type Props = {
  params: { id: string }
}

export async function GET(request: Request, { params }: Props) {
  try {
    const id = params.id

    // Get the group details
    const { data, error } = await supabaseServer.from("exercise_groups").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching group:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
