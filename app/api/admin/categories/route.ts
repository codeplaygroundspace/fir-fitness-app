import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in getCategories:", error)
    return NextResponse.json([])
  }
}
