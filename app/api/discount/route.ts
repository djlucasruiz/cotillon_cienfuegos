import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const userId = searchParams.get("userId")

  if (!code && !userId) return NextResponse.json({ error: "Parametros requeridos" }, { status: 400 })

  const email = searchParams.get("email")

  // Verificar si es primera compra por email
  if ((userId || email) && !code) {
    let query = supabaseAdmin.from("orders").select("id").limit(1)
    if (email) {
      query = query.ilike("notes", `%Email: ${email}%`)
    } else {
      query = query.eq("user_id", userId)
    }
    const { data } = await query
    return NextResponse.json({ isFirstOrder: !data || data.length === 0 })
  }

  // Validar código de descuento
  if (code) {
    const { data, error } = await supabaseAdmin
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("active", true)
      .single()

    if (error || !data) return NextResponse.json({ error: "Código inválido o expirado" }, { status: 404 })
    if (data.max_uses && data.uses >= data.max_uses) return NextResponse.json({ error: "Código agotado" }, { status: 400 })
    if (data.expires_at && new Date(data.expires_at) < new Date()) return NextResponse.json({ error: "Código expirado" }, { status: 400 })

    return NextResponse.json({ valid: true, discount: data.discount_percent, code: data.code })
  }
}

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  // Incrementar uso del código
  await supabaseAdmin.rpc("increment_code_uses", { code_text: code })
  return NextResponse.json({ success: true })
}
