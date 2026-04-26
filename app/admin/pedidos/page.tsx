"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Package, Clock, CheckCircle2, Truck, XCircle, Search, ChevronDown } from "lucide-react"
import { formatPrice } from "@/lib/products"

const STATUSES = [
  { value: "pendiente",  label: "Pendiente",  color: "oklch(0.72 0.2 50)" },
  { value: "confirmado", label: "Confirmado", color: "oklch(0.58 0.18 240)" },
  { value: "preparando", label: "Preparando", color: "oklch(0.65 0.18 35)" },
  { value: "enviado",    label: "Enviado",    color: "oklch(0.62 0.18 145)" },
  { value: "entregado",  label: "Entregado",  color: "oklch(0.55 0.18 145)" },
  { value: "cancelado",  label: "Cancelado",  color: "oklch(0.6 0.22 5)" },
]

export default function AdminPedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/admin/login"); return }
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    })
    await fetchOrders()
    setUpdating(null)
  }

  async function deleteOrder(id: string) {
    if (!confirm("¿Cancelar este pedido?")) return
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelado" })
    })
    await fetchOrders()
  }

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === "todos" || o.status === filterStatus
    const matchSearch = search === "" || String(o.order_number).includes(search)
    return matchStatus && matchSearch
  })

  const stats = {
    total: orders.length,
    pendiente: orders.filter(o => o.status === "pendiente").length,
    enviado: orders.filter(o => o.status === "enviado").length,
    entregado: orders.filter(o => o.status === "entregado").length,
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: "oklch(0.38 0.12 248)", borderTopColor: "transparent" }} />
    </main>
  )

  return (
    <main className="min-h-screen py-8 px-4" style={{ backgroundColor: "oklch(0.97 0 0)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>Gestión de Pedidos</h1>
            <p className="text-sm mt-1" style={{ color: "oklch(0.55 0 0)" }}>Administrá y actualizá el estado de los pedidos</p>
          </div>
          <button onClick={() => router.push("/admin")} className="text-sm px-4 py-2 rounded-xl border" style={{ borderColor: "oklch(0.88 0 0)" }}>
            ← Volver
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "oklch(0.38 0.12 248)" },
            { label: "Pendientes", value: stats.pendiente, color: "oklch(0.72 0.2 50)" },
            { label: "Enviados", value: stats.enviado, color: "oklch(0.62 0.18 145)" },
            { label: "Entregados", value: stats.entregado, color: "oklch(0.55 0.18 145)" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-4" style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}>
              <p className="text-xs font-semibold" style={{ color: "oklch(0.6 0 0)" }}>{s.label}</p>
              <p className="text-3xl font-extrabold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm border outline-none flex-1"
            style={{ borderColor: "oklch(0.88 0 0)", backgroundColor: "oklch(1 0 0)" }}
          />
          <div className="flex gap-2 flex-wrap">
            {["todos", ...STATUSES.map(s => s.value)].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="rounded-full px-3 py-2 text-xs font-semibold transition-all"
                style={filterStatus === s
                  ? { backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }
                  : { backgroundColor: "oklch(1 0 0)", color: "oklch(0.4 0 0)", border: "1px solid oklch(0.88 0 0)" }
                }
              >
                {s === "todos" ? "Todos" : STATUSES.find(st => st.value === s)?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista pedidos */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
            <p className="font-semibold" style={{ color: "oklch(0.45 0 0)" }}>No hay pedidos</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => {
              const status = STATUSES.find(s => s.value === order.status) || STATUSES[0]
              return (
                <div key={order.id} className="rounded-2xl border p-5" style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Pedido #{order.order_number}</p>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.6 0 0)" }}>
                        {new Date(order.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="rounded-xl px-3 py-2 text-xs font-bold border outline-none"
                        style={{ borderColor: status.color, color: status.color, backgroundColor: `${status.color}15` }}
                      >
                        {STATUSES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-xs px-3 py-2 rounded-xl border transition-all hover:opacity-70"
                        style={{ borderColor: "oklch(0.6 0.22 5)", color: "oklch(0.6 0.22 5)" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    {order.items?.map((item: any, i: number) => (
                      <p key={i} className="text-sm" style={{ color: "oklch(0.3 0.02 270)" }}>
                        {item.quantity}x {item.product?.name}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "oklch(0.93 0 0)" }}>
                    <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                      Envío: {order.shipping_province || "Retiro en local"} {order.shipping_cp && `(CP ${order.shipping_cp})`}
                    </p>
                    <p className="font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  {order.notes && (
                    <p className="text-xs mt-2 italic" style={{ color: "oklch(0.6 0 0)" }}>Nota: {order.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
