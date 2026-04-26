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
        const orderNum = data.external_reference || "0"
        
        // Update order status
        const { data: order } = await supabaseAdmin
          .from("orders")
          .update({ status: "confirmado" })
          .eq("order_number", parseInt(orderNum))
          .select()
          .single()

        // Notify local via WhatsApp using Twilio-free method
        const msg = encodeURIComponent(
          `*Nuevo pedido #${orderNum} PAGADO por Mercado Pago*
` +
          `Total: $${data.transaction_amount}
` +
          `Email: ${data.payer?.email || "N/A"}
` +
          `Ver pedidos: https://cienfuegoscotillonconcordia.com/admin/pedidos`
        )
        
        // Send notification email to admin
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://cienfuegoscotillonconcordia.com"}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "cfuegos157@gmail.com",
            orderNumber: orderNum,
            items: order?.items || [],
            total: data.transaction_amount,
            shippingCost: 0,
            nombre: data.payer?.first_name || "Cliente",
            telefono: "",
            paymentType: "Mercado Pago - PAGADO",
            shippingType: "envio",
            direccion: "",
            provincia: "",
          })
        })
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
