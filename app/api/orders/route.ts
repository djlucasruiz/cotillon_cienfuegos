import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const orderNumber = searchParams.get("orderNumber")
  const email = searchParams.get("email")

  let query = supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false })
  
  if (userId) query = query.eq("user_id", userId)
  if (orderNumber) query = query.eq("order_number", parseInt(orderNumber))
  if (email) query = query.ilike("notes", `%Email: ${email}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  updates.updated_at = new Date().toISOString()
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })
  const { error } = await supabaseAdmin.from("orders").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
