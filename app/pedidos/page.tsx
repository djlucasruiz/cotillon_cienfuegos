"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Package, Search, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/products"

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
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchOrders(data.user.id)
      else setLoading(false)
    })
  }, [])

  async function fetchOrders(userId: string) {
    const res = await fetch(`/api/orders?userId=${userId}`)
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  async function searchByNumber() {
    if (!search.trim()) return
    setLoading(true)
    const res = await fetch(`/api/orders?orderNumber=${search.trim()}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [data])
    setLoading(false)
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: "oklch(0.38 0.12 248)", borderTopColor: "transparent" }} />
    </main>
  )

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: "oklch(0.97 0 0)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "oklch(0.2 0.02 270)" }}>
          Mis Pedidos
        </h1>
        <p className="text-sm mb-8" style={{ color: "oklch(0.55 0 0)" }}>
          Buscá tu pedido por número o iniciá sesión para ver todos tus pedidos
        </p>

        {/* Buscador por número */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Número de pedido..."
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

        {/* Lista de pedidos */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
            <p className="font-semibold" style={{ color: "oklch(0.45 0 0)" }}>No hay pedidos para mostrar</p>
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
                      <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>Pedido #{order.order_number}</p>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.7 0 0)" }}>
                        {new Date(order.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                      <Icon size={13} />
                      {status.label}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    {order.items?.map((item: any, i: number) => (
                      <p key={i} className="text-sm" style={{ color: "oklch(0.3 0.02 270)" }}>
                        {item.quantity}x {item.product?.name} — {formatPrice(item.product?.price * item.quantity)}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "oklch(0.93 0 0)" }}>
                    <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                      Envío: {order.shipping_province || "Retiro en local"}
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
