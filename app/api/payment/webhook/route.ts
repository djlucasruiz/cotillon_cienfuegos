import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase"

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.type === "payment") {
      const payment = new Payment(client)
      const data = await payment.get({ id: body.data.id })
      if (data.status === "approved") {
        await supabaseAdmin
          .from("orders")
          .update({ status: "confirmado" })
          .eq("order_number", parseInt(data.external_reference || "0"))
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
