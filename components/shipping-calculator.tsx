"use client"

import { useState } from "react"
import { MapPin, Truck, Loader2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/products"

interface ShippingResult {
  cp: string
  provincia: string
  costo: number
  diasEstimados: string
  esMismaProvincia: boolean
  localidadOrigen: string
}

interface ShippingCalculatorProps {
  totalWeight?: number // en kg
  onShippingSelect?: (cost: number, cp: string, provincia: string) => void
  selectedCost?: number
}

export function ShippingCalculator({ totalWeight = 0.5, onShippingSelect, selectedCost }: ShippingCalculatorProps) {
  const [cp, setCp] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShippingResult | null>(null)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  async function calculate() {
    const clean = cp.trim().replace(/\D/g, "")
    if (clean.length < 4) { setError("Ingresá un código postal válido (4 dígitos)"); return }
    setError("")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/shipping?cp=${clean}&peso=${totalWeight}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "No se pudo calcular el envío"); setLoading(false); return }
      setResult(data)
      setOpen(true)
    } catch {
      setError("Error al consultar el servicio de envíos")
    } finally {
      setLoading(false)
    }
  }

  function handleSelect() {
    if (!result || !onShippingSelect) return
    onShippingSelect(result.costo, result.cp, result.provincia)
  }

  const isSelected = selectedCost !== undefined && selectedCost > 0 && result && selectedCost === result.costo

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "oklch(0.88 0.03 90)" }}>
      {/* Encabezado */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "oklch(0.97 0.01 90)" }}
      >
        <div className="flex items-center gap-2">
          <Truck size={16} style={{ color: "oklch(0.38 0.12 248)" }} />
          <span className="text-sm font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>
            Calcular envío
          </span>
          {isSelected && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.12)", color: "oklch(0.5 0.18 145)" }}>
              <CheckCircle2 size={10} />
              {formatPrice(selectedCost!)} agregado
            </span>
          )}
        </div>
        {open ? <ChevronUp size={15} style={{ color: "oklch(0.55 0 0)" }} />
               : <ChevronDown size={15} style={{ color: "oklch(0.55 0 0)" }} />}
      </button>

      {open && (
        <div className="px-4 py-4 border-t flex flex-col gap-4" style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)" }}>
          <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
            Enviamos desde <strong>Concordia, Entre Ríos</strong> por Correo Argentino. Ingresá tu código postal para calcular el costo.
          </p>

          {/* Input CP */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.6 0 0)" }} />
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={cp}
                onChange={(e) => { setCp(e.target.value.replace(/\D/g, "").slice(0, 5)); setError(""); setResult(null) }}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                placeholder="Ej: 1414"
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm border outline-none"
                style={{ borderColor: error ? "oklch(0.6 0.22 5)" : "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
              />
            </div>
            <button
              onClick={calculate}
              disabled={loading || cp.length < 4}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
              {loading ? "Calculando..." : "Calcular"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "oklch(0.97 0.05 5)", color: "oklch(0.55 0.22 5)" }}>
              <AlertCircle size={14} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "oklch(0.38 0.12 248 / 0.25)" }}>
              <div className="px-4 py-3" style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.05)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>
                      {result.provincia} · CP {result.cp}
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
                      Entrega estimada: <strong>{result.diasEstimados} días hábiles</strong>
                    </p>
                    {result.esMismaProvincia && (
                      <p className="text-xs font-semibold" style={{ color: "oklch(0.55 0.18 145)" }}>
                        Envío provincial — tarifa reducida
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>
                      {formatPrice(result.costo)}
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.65 0 0)" }}>por Correo Arg.</p>
                  </div>
                </div>
              </div>
              {onShippingSelect && (
                <div className="px-4 py-2.5 border-t" style={{ borderColor: "oklch(0.88 0.03 90)" }}>
                  <button
                    onClick={handleSelect}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: isSelected ? "oklch(0.62 0.18 145 / 0.1)" : "oklch(0.38 0.12 248)",
                      color: isSelected ? "oklch(0.5 0.18 145)" : "oklch(1 0 0)",
                      border: isSelected ? "1px solid oklch(0.62 0.18 145 / 0.4)" : "none",
                    }}
                  >
                    {isSelected ? (
                      <><CheckCircle2 size={14} /> Envío seleccionado</>
                    ) : (
                      <><CheckCircle2 size={14} /> Agregar este envío al pedido</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="text-xs" style={{ color: "oklch(0.7 0 0)" }}>
            * Precios estimados. El costo final puede variar según el peso y dimensiones del paquete.
            También podés retirar en el local sin costo.
          </p>
        </div>
      )}
    </div>
  )
}
