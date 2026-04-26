import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, orderNumber, email, shippingCost, discount } = body

    const preference = new Preference(client)

    const mpItems = items.map((item: any) => ({
      id: item.product?.id || item.id,
      title: item.product?.name || item.name,
      quantity: item.quantity,
      unit_price: Math.round((item.product?.price || item.price) * (1 - (discount || 0) / 100)),
      currency_id: "ARS",
    }))

    if (shippingCost > 0) {
      mpItems.push({
        id: "shipping",
        title: "Costo de envío",
        quantity: 1,
        unit_price: Math.round(shippingCost),
        currency_id: "ARS",
      })
    }

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: { email },
        external_reference: String(orderNumber),
        back_urls: {
          success: `https://cienfuegoscotillonconcordia.com/pedidos?status=success&order=${orderNumber}`,
          failure: `https://cienfuegoscotillonconcordia.com/pedidos?status=failure&order=${orderNumber}`,
          pending: `https://cienfuegoscotillonconcordia.com/pedidos?status=pending&order=${orderNumber}`,
        },
        auto_return: "approved",
        notification_url: `https://cienfuegoscotillonconcordia.com/api/payment/webhook`,
        statement_descriptor: "COTILLON CIENFUEGOS",
      }
    })

    return NextResponse.json({ 
      init_point: result.init_point,
      preference_id: result.id 
    })
  } catch (error) {
    console.error("MP Error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
