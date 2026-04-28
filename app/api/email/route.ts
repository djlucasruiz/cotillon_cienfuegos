import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { to, orderNumber, items, total, shippingCost, nombre, telefono, paymentType, shippingType, direccion, provincia } = body

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${item.product?.name || item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice((item.product?.price || item.price) * item.quantity)}</td>
    </tr>
  `).join("")

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:32px 24px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800">🎉 Cotillón Cienfuegos</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px">Concordia, Entre Ríos</p>
    </div>

    <!-- Confirmacion -->
    <div style="padding:24px;border-bottom:1px solid #f0f0f0;text-align:center">
      <div style="display:inline-block;background:#fff3cd;border:2px solid #ffc107;border-radius:50px;padding:8px 20px;margin-bottom:12px">
        <span style="font-size:13px;font-weight:700;color:#856404">Pedido recibido ✓</span>
      </div>
      <h2 style="margin:0;font-size:28px;font-weight:800;color:#333">Pedido #${orderNumber}</h2>
      <p style="margin:8px 0 0;color:#666;font-size:14px">Hola <strong>${nombre}</strong>, recibimos tu pedido correctamente.</p>
    </div>

    <!-- Productos -->
    <div style="padding:24px">
      <h3 style="margin:0 0 16px;font-size:15px;font-weight:700;color:#333">Detalle del pedido</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="background:#f8f8f8">
            <th style="padding:8px 12px;text-align:left;color:#666;font-weight:600">Producto</th>
            <th style="padding:8px 12px;text-align:center;color:#666;font-weight:600">Cant.</th>
            <th style="padding:8px 12px;text-align:right;color:#666;font-weight:600">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="margin-top:16px;padding-top:12px;border-top:2px solid #f0f0f0">
        ${shippingCost > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#666;margin-bottom:8px"><span>Envío a ${provincia}</span><span>${formatPrice(shippingCost)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#333">
          <span>Total</span>
          <span style="color:#e91e8c">${formatPrice(total)}</span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div style="padding:0 24px 24px;display:flex;gap:12px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px;background:#f8f8f8;border-radius:8px;padding:12px">
        <p style="margin:0 0 4px;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Entrega</p>
        <p style="margin:0;font-size:13px;color:#333;font-weight:600">${shippingType === "envio" ? `Envío a ${direccion}, ${provincia}` : "Retiro en local"}</p>
      </div>
      <div style="flex:1;min-width:200px;background:#f8f8f8;border-radius:8px;padding:12px">
        <p style="margin:0 0 4px;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Pago</p>
        <p style="margin:0;font-size:13px;color:#333;font-weight:600">${paymentType}</p>
      </div>
    </div>

    <!-- Seguimiento -->
    <div style="padding:20px 24px;background:#f0f7ff;border-top:1px solid #e0eeff">
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a56db">📦 Seguí tu pedido</p>
      <p style="margin:0;font-size:13px;color:#555">Ingresá a <a href="https://cienfuegoscotillonconcordia.com/pedidos" style="color:#1a56db;font-weight:600">cienfuegoscotillonconcordia.com/pedidos</a> y buscá el número <strong>#${orderNumber}</strong> para ver el estado de tu pedido en tiempo real.</p>
    </div>

    <!-- Contacto -->
    <div style="padding:20px 24px;text-align:center;border-top:1px solid #f0f0f0">
      <p style="margin:0;font-size:13px;color:#666">¿Consultas? Escribinos por WhatsApp</p>
      <a href="https://wa.me/5493454289474" style="display:inline-block;margin-top:8px;background:#25D366;color:#fff;text-decoration:none;padding:8px 20px;border-radius:50px;font-size:13px;font-weight:700">💬 Contactar por WhatsApp</a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;background:#f8f8f8;text-align:center">
      <p style="margin:0;font-size:11px;color:#999">Cotillón Cienfuegos · San Lorenzo Oeste 325, Concordia, Entre Ríos · Tel: 345 428-9474</p>
    </div>

  </div>
</body>
</html>
  `

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: "Cotillón Cienfuegos <pedidos@cienfuegoscotillonconcordia.com>",
      to: [to],
      subject: `✅ Pedido #${orderNumber} recibido - Cotillón Cienfuegos`,
      html,
    })
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
