"use client"

import { useState, useEffect } from "react"
import {
  X, Trash2, Plus, Minus, ShoppingBag, MessageCircle,
  ArrowRight, ArrowLeft, User, MapPin, Package, CheckCircle2,
  Truck, Store, CreditCard, Banknote, Building2, Wallet, Hash
} from "lucide-react"
import { type CartItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/products"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { getRetailSession } from "@/lib/retail-store"
import { supabase } from "@/lib/supabase"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  totalPrice: number
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onClear: () => void
}

type Step = "cart" | "form" | "confirm" | "sent"
type ShippingType = "envio" | "retiro"
type PaymentType = "transferencia" | "deposito" | "tarjeta" | "billetera"

interface OrderForm {
  nombre: string
  telefono: string
  email: string
  shippingType: ShippingType
  direccion: string
  localidad: string
  provincia: string
  codigoPostal: string
  paymentType: PaymentType
  nota: string
}

const PAYMENT_LABELS: Record<PaymentType, string> = {
  transferencia: "Transferencia bancaria",
  deposito: "Deposito bancario",
  tarjeta: "Tarjeta de credito / debito",
  billetera: "Billetera virtual (MP, Uala...)",
}

const PAYMENT_ICONS: Record<PaymentType, React.ReactNode> = {
  transferencia: <Banknote size={15} />,
  deposito: <Building2 size={15} />,
  tarjeta: <CreditCard size={15} />,
  billetera: <Wallet size={15} />,
}

const defaultForm: OrderForm = {
  nombre: "",
  telefono: "",
  email: "",
  shippingType: "envio",
  direccion: "",
  localidad: "",
  provincia: "",
  codigoPostal: "",
  paymentType: "transferencia",
  nota: "",
}

function generateOrderId() {
  const now = new Date()
  const date = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear()).slice(2)}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `CC-${date}-${rand}`
}

export function CartDrawer({
  open,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const [step, setStep] = useState<Step>("cart")
  useEffect(() => {
    const session = getRetailSession()
    if (session) {
      setForm((prev) => ({ ...prev, nombre: session.name || prev.nombre, email: session.email || prev.email }))
    }
  }, [])
  // Pre-fill form with session data
  useEffect(() => {
    const session = getRetailSession()
    if (session) {
      setForm((prev) => ({
        ...prev,
        nombre: session.name || prev.nombre,
        email: session.email || prev.email,
      }))
    }
  }, [])
  const [form, setForm] = useState<OrderForm>(defaultForm)
  const [orderId, setOrderId] = useState(generateOrderId)
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({})
  const [shippingCost, setShippingCost] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountCode, setDiscountCode] = useState("")
  const [discountInput, setDiscountInput] = useState("")
  const [discountError, setDiscountError] = useState("")
  const [discountLoading, setDiscountLoading] = useState(false)
  const [isFirstOrder, setIsFirstOrder] = useState(false)
  const [shippingProvincia, setShippingProvincia] = useState("")

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  // Peso estimado: 0.3kg base + 0.2kg por item
  const estimatedWeight = Math.max(0.5, totalItems * 0.2 + 0.3)
  const totalWithShipping = totalPrice + shippingCost
  const discountAmount = Math.round(totalPrice * discountPercent / 100)
  const totalWithDiscount = totalWithShipping - discountAmount

  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep("cart")
      setForm(defaultForm)
      setErrors({})
      setOrderId(generateOrderId())
      setShippingCost(0)
      setShippingProvincia("")
    }, 300)
  }

  function setField<K extends keyof OrderForm>(key: K, value: OrderForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof OrderForm, string>> = {}
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre completo"
    if (!form.telefono.trim()) e.telefono = "Ingresa tu telefono"
    if (form.shippingType === "envio") {
      if (!form.direccion.trim()) e.direccion = "Ingresa tu direccion"
      if (!form.localidad.trim()) e.localidad = "Ingresa tu localidad"
      if (!form.provincia.trim()) e.provincia = "Ingresa tu provincia"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function buildWhatsAppMessage(): string {
    const productLines = items
      .map((i) => `  • ${i.product.name} x${i.quantity}  →  ${formatPrice(i.product.price * i.quantity)}`)
      .join("\n")

    const shipping =
      form.shippingType === "envio"
        ? `Envio a domicilio\n  ${form.direccion}, ${form.localidad}, ${form.provincia}${form.codigoPostal ? ` (CP ${form.codigoPostal})` : ""}`
        : "Retiro en local — San Lorenzo Oeste 325, Concordia"

    const lines = [
      `*Nuevo pedido #${orderId}*`,
      ``,
      `*Cliente*`,
      `  Nombre: ${form.nombre}`,
      `  Telefono: ${form.telefono}`,
      form.email ? `  Email: ${form.email}` : null,
      ``,
      `*Productos*`,
      productLines,
      ``,
      `*Subtotal: ${formatPrice(totalPrice)}*`,
      shippingCost > 0 ? `*Envio estimado: ${formatPrice(shippingCost)}*` : null,
      `*Total: ${formatPrice(totalWithShipping)}*`,
      ``,
      `*Entrega*`,
      `  ${shipping}`,
      ``,
      `*Forma de pago*`,
      `  ${PAYMENT_LABELS[form.paymentType]}`,
      form.nota.trim() ? `\n*Nota del cliente*\n  ${form.nota}` : null,
      ``,
      `_Pedido enviado desde la tienda online_`,
    ]

    return lines.filter((l) => l !== null).join("\n")
  }

  async function saveOrder() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || null,
          status: "pendiente",
          items: items,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          shipping_cp: form.codigoPostal || null,
          shipping_province: form.provincia || null,
          total: totalPrice + shippingCost,
          notes: `Nombre: ${form.nombre} | Tel: ${form.telefono} | Email: ${form.email} | Pago: ${PAYMENT_LABELS[form.paymentType]} | ${form.nota}`,
        })
      })
      const order = await res.json()
      if (form.email && order.order_number) {
        await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: form.email,
            orderNumber: order.order_number,
            items,
            total: totalPrice + shippingCost,
            shippingCost,
            nombre: form.nombre,
            telefono: form.telefono,
            paymentType: PAYMENT_LABELS[form.paymentType],
            shippingType: form.shippingType,
            direccion: form.direccion,
            provincia: form.provincia,
          })
        })
      }
    } catch (e) {
      console.error("Error guardando pedido:", e)
    }
  }

  const whatsappUrl = `https://wa.me/5493454289474?text=${encodeURIComponent(buildWhatsAppMessage())}`

  // ─── STEP INDICATORS ────────────────────────────────────────────────────────
  const steps: { id: Step; label: string }[] = [
    { id: "cart", label: "Carrito" },
    { id: "form", label: "Tus datos" },
    { id: "confirm", label: "Confirmar" },
  ]
  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "oklch(0.98 0.01 90)" }}
      >
        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: "oklch(0.6 0.22 5)" }} />
            <h2 className="text-base font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>
              {step === "cart" && "Mi carrito"}
              {step === "form" && "Datos del pedido"}
              {step === "confirm" && "Confirmar pedido"}
            </h2>
            {step === "cart" && items.length > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === "cart" && items.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "oklch(0.55 0.03 270)" }}
              >
                Vaciar
              </button>
            )}
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 transition-colors hover:bg-muted"
              style={{ color: "oklch(0.4 0.03 270)" }}
              aria-label="Cerrar carrito"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── STEP INDICATOR ── */}
        {items.length > 0 && step !== "sent" && (
          <div
            className="flex items-center px-5 py-3 gap-0 shrink-0 border-b"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}
          >
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      backgroundColor: idx <= stepIndex ? "oklch(0.6 0.22 5)" : "oklch(0.88 0.03 90)",
                      color: idx <= stepIndex ? "oklch(1 0 0)" : "oklch(0.5 0 0)",
                    }}
                  >
                    {idx < stepIndex ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: idx <= stepIndex ? "oklch(0.6 0.22 5)" : "oklch(0.6 0 0)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className="h-0.5 flex-1 mb-4 mx-1 rounded transition-all"
                    style={{
                      backgroundColor: idx < stepIndex ? "oklch(0.6 0.22 5)" : "oklch(0.88 0.03 90)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1: CARRITO */}
          {step === "cart" && (
            <div className="px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <div className="rounded-full p-5" style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.08)" }}>
                    <ShoppingBag size={32} style={{ color: "oklch(0.6 0.22 5)" }} />
                  </div>
                  <p className="font-semibold" style={{ color: "oklch(0.3 0.02 270)" }}>Tu carrito esta vacio</p>
                  <p className="text-sm" style={{ color: "oklch(0.55 0.03 270)" }}>Agrega productos desde el catalogo</p>
                  <button
                    onClick={handleClose}
                    className="mt-2 rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex gap-3 rounded-2xl p-3"
                      style={{ backgroundColor: "oklch(1 0 0)" }}
                    >
                      <img
                        src={product.image}
                        alt={product.imageAlt}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-snug truncate" style={{ color: "oklch(0.2 0.02 270)" }}>
                          {product.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 270)" }}>
                          {formatPrice(product.price)} c/u
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div
                            className="flex items-center rounded-lg overflow-hidden border"
                            style={{ borderColor: "oklch(0.88 0.03 90)" }}
                          >
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                              className="px-2 py-1 transition-colors disabled:opacity-40 hover:bg-muted"
                              style={{ color: "oklch(0.3 0.02 270)" }}
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={12} />
                            </button>
                            <span
                              className="px-3 py-1 text-xs font-bold border-x"
                              style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.2 0.02 270)" }}
                            >
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="px-2 py-1 transition-colors hover:bg-muted"
                              style={{ color: "oklch(0.3 0.02 270)" }}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>
                              {formatPrice(product.price * quantity)}
                            </span>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="rounded-lg p-1 transition-colors hover:bg-red-50"
                              style={{ color: "oklch(0.577 0.245 27.325)" }}
                              aria-label={`Eliminar ${product.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* STEP 2: FORMULARIO */}
          {step === "form" && (
            <div className="px-4 py-4 flex flex-col gap-5">

              {/* Datos personales */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <User size={14} style={{ color: "oklch(0.6 0.22 5)" }} />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "oklch(0.6 0.22 5)" }}>
                    Datos personales
                  </p>
                </div>
                <FormField
                  label="Nombre completo *"
                  value={form.nombre}
                  onChange={(v) => setField("nombre", v)}
                  placeholder="Ej: Maria Gonzalez"
                  error={errors.nombre}
                />
                <FormField
                  label="Telefono / WhatsApp *"
                  value={form.telefono}
                  onChange={(v) => setField("telefono", v)}
                  placeholder="Ej: 345 412-3456"
                  type="tel"
                  error={errors.telefono}
                />
                <FormField
                  label="Email (opcional)"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  placeholder="tu@email.com"
                  type="email"
                />
              </section>

              {/* Entrega */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Package size={14} style={{ color: "oklch(0.6 0.22 5)" }} />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "oklch(0.6 0.22 5)" }}>
                    Tipo de entrega
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["envio", "retiro"] as ShippingType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setField("shippingType", type)}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-3 border-2 transition-all text-xs font-semibold"
                      style={{
                        borderColor: form.shippingType === type ? "oklch(0.6 0.22 5)" : "oklch(0.88 0.03 90)",
                        backgroundColor: form.shippingType === type ? "oklch(0.6 0.22 5 / 0.07)" : "oklch(1 0 0)",
                        color: form.shippingType === type ? "oklch(0.6 0.22 5)" : "oklch(0.4 0 0)",
                      }}
                    >
                      {type === "envio" ? <Truck size={18} /> : <Store size={18} />}
                      {type === "envio" ? "Envio a domicilio" : "Retiro en local"}
                    </button>
                  ))}
                </div>

                {form.shippingType === "envio" && (
                  <div className="flex flex-col gap-2.5 rounded-xl p-3 border" style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}>
                    <FormField
                      label="Direccion *"
                      value={form.direccion}
                      onChange={(v) => setField("direccion", v)}
                      placeholder="Calle y numero"
                      error={errors.direccion}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        label="Localidad *"
                        value={form.localidad}
                        onChange={(v) => setField("localidad", v)}
                        placeholder="Ciudad"
                        error={errors.localidad}
                      />
                      <FormField
                        label="CP"
                        value={form.codigoPostal}
                        onChange={(v) => setField("codigoPostal", v)}
                        placeholder="3200"
                      />
                    </div>
                    <FormField
                      label="Provincia *"
                      value={form.provincia}
                      onChange={(v) => setField("provincia", v)}
                      placeholder="Entre Rios"
                      error={errors.provincia}
                    />
                  </div>
                )}

                {form.shippingType === "retiro" && (
                  <div
                    className="rounded-xl p-3 text-xs leading-relaxed border flex items-start gap-2"
                    style={{ borderColor: "oklch(0.62 0.18 145 / 0.3)", backgroundColor: "oklch(0.62 0.18 145 / 0.07)", color: "oklch(0.35 0 0)" }}
                  >
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "oklch(0.62 0.18 145)" }} />
                    <span>
                      <strong>San Lorenzo Oeste 325</strong>, Concordia, Entre Rios.<br />
                      Lun–Sab: 09:00–13:00 y 16:30–20:30
                    </span>
                  </div>
                )}

                {/* Código de descuento */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
                      Código de descuento
                    </label>
                    {isFirstOrder && discountPercent === 15 && !discountCode && (
                      <div className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.1)", color: "oklch(0.45 0.18 145)", border: "1px solid oklch(0.62 0.18 145 / 0.3)" }}>
                        🎉 ¡15% de descuento aplicado por ser tu primera compra!
                      </div>
                    )}
                    {discountCode && (
                      <div className="rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between" style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.1)", color: "oklch(0.45 0.18 145)", border: "1px solid oklch(0.62 0.18 145 / 0.3)" }}>
                        <span>✅ Código {discountCode} — {discountPercent}% de descuento</span>
                        <button onClick={() => { setDiscountCode(""); setDiscountPercent(isFirstOrder ? 15 : 0); setDiscountInput("") }} className="ml-2 opacity-60 hover:opacity-100">✕</button>
                      </div>
                    )}
                    {!discountCode && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ingresá tu código..."
                          value={discountInput}
                          onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError("") }}
                          className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
                          style={{ borderColor: "oklch(0.88 0 0)", backgroundColor: "oklch(1 0 0)" }}
                        />
                        <button
                          onClick={async () => {
                            if (!discountInput.trim()) return
                            setDiscountLoading(true)
                            setDiscountError("")
                            const res = await fetch(`/api/discount?code=${discountInput.trim()}`)
                            const data = await res.json()
                            setDiscountLoading(false)
                            if (data.error) { setDiscountError(data.error); return }
                            setDiscountCode(data.code)
                            setDiscountPercent(data.discount)
                          }}
                          disabled={discountLoading}
                          className="rounded-xl px-4 py-2 text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                          style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
                        >
                          {discountLoading ? "..." : "Aplicar"}
                        </button>
                      </div>
                    )}
                    {discountError && <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{discountError}</p>}
                  </div>

                  <ShippingCalculator
                    totalWeight={estimatedWeight}
                    selectedCost={shippingCost}
                    onShippingSelect={(cost, cp, provincia) => {
                      setShippingCost(cost)
                      setShippingProvincia(provincia)
                      if (cp) setField("codigoPostal", cp)
                      if (provincia) setField("provincia", provincia)
                    }}
                  />
              </section>

              {/* Metodo de pago */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} style={{ color: "oklch(0.6 0.22 5)" }} />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "oklch(0.6 0.22 5)" }}>
                    Forma de pago
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(PAYMENT_LABELS) as PaymentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setField("paymentType", type)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 border-2 transition-all text-xs font-semibold text-left"
                      style={{
                        borderColor: form.paymentType === type ? "oklch(0.6 0.22 5)" : "oklch(0.88 0.03 90)",
                        backgroundColor: form.paymentType === type ? "oklch(0.6 0.22 5 / 0.07)" : "oklch(1 0 0)",
                        color: form.paymentType === type ? "oklch(0.6 0.22 5)" : "oklch(0.4 0 0)",
                      }}
                    >
                      {PAYMENT_ICONS[type]}
                      {PAYMENT_LABELS[type]}
                    </button>
                  ))}
                </div>
              </section>

              {/* Nota */}
              <section className="flex flex-col gap-2">
                <label className="text-xs font-semibold" style={{ color: "oklch(0.4 0 0)" }}>
                  Nota adicional (opcional)
                </label>
                <textarea
                  value={form.nota}
                  onChange={(e) => setField("nota", e.target.value)}
                  placeholder="Ej: timbre 2do piso, horario preferido de entrega..."
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2 text-xs resize-none outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "oklch(0.88 0.03 90)",
                    backgroundColor: "oklch(1 0 0)",
                    color: "oklch(0.2 0.02 270)",
                  }}
                />
              </section>
            </div>
          )}

          {/* STEP 3: CONFIRMACION */}
          {step === "confirm" && (
            <div className="px-4 py-4 flex flex-col gap-4">

              {/* Numero de pedido */}
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 border"
                style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.07)", borderColor: "oklch(0.6 0.22 5 / 0.2)" }}
              >
                <Hash size={14} style={{ color: "oklch(0.6 0.22 5)" }} />
                <div>
                  <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>Numero de pedido</p>
                  <p className="text-sm font-extrabold tracking-wider" style={{ color: "oklch(0.6 0.22 5)" }}>{orderId}</p>
                </div>
              </div>

              {/* Productos */}
              <SummaryBlock title="Productos">
                {items.map((i) => (
                  <div key={i.product.id} className="flex justify-between text-xs">
                    <span style={{ color: "oklch(0.35 0 0)" }}>
                      {i.product.name} x{i.quantity}
                    </span>
                    <span className="font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>
                      {formatPrice(i.product.price * i.quantity)}
                    </span>
                  </div>
                ))}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-xs pt-1">
                    <span style={{ color: "oklch(0.55 0 0)" }}>Envío ({shippingProvincia})</span>
                    <span style={{ color: "oklch(0.38 0.12 248)" }}>{formatPrice(shippingCost)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: "oklch(0.55 0.18 145)" }}>
                    <span>Descuento {discountPercent}%</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t mt-1" style={{ borderColor: "oklch(0.88 0.03 90)" }}>
                  <span style={{ color: "oklch(0.2 0.02 270)" }}>Total</span>
                  <span style={{ color: "oklch(0.6 0.22 5)" }}>{formatPrice(totalWithDiscount)}</span>
                </div>
              </SummaryBlock>

              {/* Datos del cliente */}
              <SummaryBlock title="Cliente">
                <SummaryRow label="Nombre" value={form.nombre} />
                <SummaryRow label="Telefono" value={form.telefono} />
                {form.email && <SummaryRow label="Email" value={form.email} />}
              </SummaryBlock>

              {/* Entrega */}
              <SummaryBlock title="Entrega">
                <SummaryRow
                  label="Tipo"
                  value={form.shippingType === "envio" ? "Envio a domicilio" : "Retiro en local"}
                />
                {form.shippingType === "envio" && (
                  <>
                    <SummaryRow label="Direccion" value={form.direccion} />
                    <SummaryRow label="Localidad" value={`${form.localidad}${form.codigoPostal ? ` (CP ${form.codigoPostal})` : ""}`} />
                    <SummaryRow label="Provincia" value={form.provincia} />
                  </>
                )}
                {form.shippingType === "retiro" && (
                  <SummaryRow label="Direccion" value="San Lorenzo Oeste 325, Concordia" />
                )}
              </SummaryBlock>

              {/* Pago */}
              <SummaryBlock title="Forma de pago">
                <SummaryRow label="Metodo" value={PAYMENT_LABELS[form.paymentType]} />
              </SummaryBlock>

              {form.nota && (
                <SummaryBlock title="Nota">
                  <p className="text-xs" style={{ color: "oklch(0.35 0 0)" }}>{form.nota}</p>
                </SummaryBlock>
              )}

              <p className="text-xs text-center leading-relaxed px-2" style={{ color: "oklch(0.55 0 0)" }}>
                Al tocar <strong>Enviar pedido</strong> se abre WhatsApp con todos los datos listos. La tienda confirmara disponibilidad y coordinara el pago y envio.
              </p>
            </div>
          )}

          {/* STEP 4: ENVIADO */}
          {step === "sent" && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-10 gap-5 text-center">
              <div
                className="rounded-full p-5"
                style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.12)" }}
              >
                <CheckCircle2 size={48} style={{ color: "oklch(0.62 0.18 145)" }} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
                  Pedido enviado
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.5 0 0)" }}>
                  Tu pedido <strong style={{ color: "oklch(0.6 0.22 5)" }}>#{orderId}</strong> fue enviado por WhatsApp.
                  La tienda te va a confirmar la disponibilidad y coordinar la entrega.
                </p>
              </div>
              <div
                className="w-full rounded-2xl p-4 border flex flex-col gap-2 text-left"
                style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}
              >
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "oklch(0.6 0.22 5)" }}>
                  Resumen del pedido
                </p>
                {items.map((i) => (
                  <div key={i.product.id} className="flex justify-between text-xs">
                    <span style={{ color: "oklch(0.4 0 0)" }}>{i.product.name} x{i.quantity}</span>
                    <span className="font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>{formatPrice(i.product.price * i.quantity)}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between text-sm font-bold pt-2 border-t mt-1"
                  style={{ borderColor: "oklch(0.88 0.03 90)" }}
                >
                  <span style={{ color: "oklch(0.2 0.02 270)" }}>Total</span>
                  <span style={{ color: "oklch(0.6 0.22 5)" }}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <a
                  href={`https://www.instagram.com/cienfuegoscotillon_concordia/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: "oklch(0.6 0.22 5)", color: "oklch(0.6 0.22 5)" }}
                >
                  Seguinos en Instagram
                </a>
                <button
                  onClick={handleClose}
                  className="rounded-full py-2.5 text-sm font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER / ACCIONES ── */}
        {items.length > 0 && step !== "sent" && (
          <div
            className="px-4 py-4 border-t flex flex-col gap-3 shrink-0"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}
          >
            {/* Total siempre visible */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "oklch(0.45 0.03 270)" }}>
                Total:
              </span>
              <span className="text-xl font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Botones por paso */}
            {step === "cart" && (
              <button
                onClick={() => {
                  const session = getRetailSession()
                  if (!session) {
                    onClose()
                    document.dispatchEvent(new CustomEvent("open-auth-modal"))
                    return
                  }
                  // Check first order
                  const sessionCheck = getRetailSession()
                  if (sessionCheck) {
                    fetch(`/api/discount?userId=${sessionCheck.id}`)
                      .then(r => r.json())
                      .then(d => {
                        if (d.isFirstOrder) {
                          setIsFirstOrder(true)
                          setDiscountPercent(15)
                        }
                      })
                  }
                  setStep("form")
                }}
                className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
              >
                Continuar con el pedido
                <ArrowRight size={16} />
              </button>
            )}

            {step === "form" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("cart")}
                  className="flex items-center justify-center gap-1 rounded-full py-3 px-4 text-sm font-bold transition-all border hover:bg-muted"
                  style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.4 0 0)" }}
                >
                  <ArrowLeft size={15} />
                  Volver
                </button>
                <button
                  onClick={() => {
                    if (validate()) setStep("confirm")
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                >
                  Revisar pedido
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === "confirm" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center justify-center gap-1 rounded-full py-3 px-4 text-sm font-bold transition-all border hover:bg-muted"
                  style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.4 0 0)" }}
                >
                  <ArrowLeft size={15} />
                  Editar
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { saveOrder(); onClear(); setStep("sent") }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: "oklch(0.62 0.18 145)", color: "oklch(1 0 0)" }}
                >
                  <MessageCircle size={18} />
                  Enviar pedido
                </a>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: "oklch(0.4 0 0)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:ring-2 transition-all"
        style={{
          borderColor: error ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.03 90)",
          backgroundColor: "oklch(1 0 0)",
          color: "oklch(0.2 0.02 270)",
        }}
      />
      {error && (
        <p className="text-xs" style={{ color: "oklch(0.577 0.245 27.325)" }}>{error}</p>
      )}
    </div>
  )
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-2" style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "oklch(0.6 0.22 5)" }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span style={{ color: "oklch(0.55 0 0)" }}>{label}</span>
      <span className="font-semibold text-right" style={{ color: "oklch(0.2 0.02 270)" }}>{value}</span>
    </div>
  )
}
