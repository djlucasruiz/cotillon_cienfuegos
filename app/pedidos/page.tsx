"use client"
import { useState, useEffect } from "react"
import { Package, Search, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/products"
import { getRetailSession } from "@/lib/retail-store"

const STATUS_INFO: Record<string, { label: string; color: string; icon: any }> = {
  pendiente:   { label: "Pendiente",   color: "oklch(0.72 0.2 50)",   icon: Clock },
  confirmado:  { label: "Confirmado",  color: "oklch(0.58 0.18 240)", icon: CheckCircle2 },
  preparando:  { label: "Preparando", color: "oklch(0.65 0.18 35)",  icon: Package },
  enviado:     { label: "Enviado",    color: "oklch(0.62 0.18 145)", icon: Truck },
  entregado:   { label: "Entregado",  color: "oklch(0.55 0.18 145)", icon: CheckCircle2 },
  cancelado:   { label: "Cancelado",  color: "oklch(0.6 0.22 5)",    icon: XCircle },
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [session, setSession] = useState<any>(null)
  const [mpStatus, setMpStatus] = useState<{ status: string; orderNum: string } | null>(null)

  useEffect(() => {
    const s = getRetailSession()
    setSession(s)
    if (s) fetchOrdersByEmail(s.email)
    else setLoading(false)

    // Check if coming back from MP payment
    const params = new URLSearchParams(window.location.search)
    const status = params.get("status")
    const orderNum = params.get("order")
    if (status === "success" && orderNum) {
      setMpStatus({ status: "success", orderNum })
    } else if (status === "failure" && orderNum) {
      setMpStatus({ status: "failure", orderNum })
    } else if (status === "pending" && orderNum) {
      setMpStatus({ status: "pending", orderNum })
    }
  }, [])

  async function fetchOrdersByEmail(email: string) {
    setLoading(true)
    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function searchByNumber() {
    if (!search.trim()) return
    setLoading(true)
    const res = await fetch(`/api/orders?orderNumber=${search.trim()}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [data].filter(Boolean))
    setLoading(false)
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: "oklch(0.97 0 0)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "oklch(0.2 0.02 270)" }}>
          Mis Pedidos
        </h1>
        <p className="text-sm mb-6" style={{ color: "oklch(0.55 0 0)" }}>
          {session ? `Pedidos de ${session.email}` : "Iniciá sesión para ver tus pedidos o buscá por número"}
        </p>
        {mpStatus && (
          <div className="rounded-2xl p-4 mb-6 border" style={{
            backgroundColor: mpStatus.status === "success" ? "oklch(0.62 0.18 145 / 0.1)" : mpStatus.status === "failure" ? "oklch(0.6 0.22 5 / 0.1)" : "oklch(0.72 0.2 50 / 0.1)",
            borderColor: mpStatus.status === "success" ? "oklch(0.62 0.18 145 / 0.3)" : mpStatus.status === "failure" ? "oklch(0.6 0.22 5 / 0.3)" : "oklch(0.72 0.2 50 / 0.3)",
          }}>
            {mpStatus.status === "success" && (
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "oklch(0.45 0.18 145)" }}>✅ Pago confirmado - Pedido #{mpStatus.orderNum}</p>
                <p className="text-xs mb-3" style={{ color: "oklch(0.5 0 0)" }}>Tu pago fue procesado. Por favor avisanos por WhatsApp para coordinar el envío.</p>
                
                  href={`https://wa.me/5493454289474?text=${encodeURIComponent(`Hola! Acabo de pagar el pedido #${mpStatus.orderNum} por Mercado Pago. Quedo a la espera de confirmar el envío.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
                  style={{ backgroundColor: "oklch(0.55 0.16 145)", color: "oklch(1 0 0)" }}
                >
                  💬 Avisar por WhatsApp
                </a>
              </div>
            )}
            {mpStatus.status === "failure" && (
              <p className="font-bold text-sm" style={{ color: "oklch(0.55 0.22 5)" }}>❌ El pago no fue procesado. Podés intentar nuevamente o elegir otro método.</p>
            )}
            {mpStatus.status === "pending" && (
              <p className="font-bold text-sm" style={{ color: "oklch(0.6 0.2 50)" }}>⏳ Pago pendiente #{mpStatus.orderNum}. Te avisaremos cuando se confirme.</p>
            )}
          </div>
        )}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Buscar por número de pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchByNumber()}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0 0)", backgroundColor: "oklch(1 0 0)" }}
          />
          <button
            onClick={searchByNumber}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
          >
            <Search size={15} />
            Buscar
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: "oklch(0.38 0.12 248)", borderTopColor: "transparent" }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
            <p className="font-semibold" style={{ color: "oklch(0.45 0 0)" }}>
              {session ? "No tenés pedidos todavía" : "No hay pedidos para mostrar"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = STATUS_INFO[order.status] || STATUS_INFO.pendiente
              const Icon = status.icon
              return (
                <div key={order.id} className="rounded-2xl border p-5" style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Pedido #{order.order_number}</p>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.7 0 0)" }}>
                        {new Date(order.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold" style={{ backgroundColor: status.color + "20", color: status.color }}>
                      <Icon size={13} />
                      {status.label}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    {order.items?.map((item: any, i: number) => (
                      <p key={i} className="text-sm" style={{ color: "oklch(0.3 0.02 270)" }}>
                        {item.quantity}x {item.product?.name} — {formatPrice((item.product?.price || 0) * item.quantity)}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "oklch(0.93 0 0)" }}>
                    <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                      {order.shipping_province ? "Envio a " + order.shipping_province : "Retiro en local"}
                    </p>
                    <p className="font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
