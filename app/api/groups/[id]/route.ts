import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// Use any type to bypass TypeScript errors
export async function GET(request: Request, props: any) {
  try {
    const { params } = props
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
