"use client"

import { Banknote, CreditCard, Building2, Wallet } from "lucide-react"

const methods = [
  {
    icon: Banknote,
    title: "Transferencia bancaria",
    description: "Transferí desde cualquier banco o billetera virtual al instante.",
    color: "oklch(0.62 0.18 145)",
    bg: "oklch(0.62 0.18 145 / 0.1)",
    border: "oklch(0.62 0.18 145 / 0.25)",
  },
  {
    icon: Building2,
    title: "Depósito bancario",
    description: "Realizá un depósito en efectivo en cualquier sucursal bancaria.",
    color: "oklch(0.58 0.18 240)",
    bg: "oklch(0.58 0.18 240 / 0.1)",
    border: "oklch(0.58 0.18 240 / 0.25)",
  },
  {
    icon: CreditCard,
    title: "Tarjeta de crédito / débito",
    description: "Pagá con Visa, Mastercard, Cabal y más. Cuotas disponibles.",
    color: "oklch(0.6 0.22 5)",
    bg: "oklch(0.6 0.22 5 / 0.1)",
    border: "oklch(0.6 0.22 5 / 0.25)",
  },
  {
    icon: Wallet,
    title: "Billeteras virtuales",
    description: "Mercado Pago, Ualá, Naranja X y otras billeteras aceptadas.",
    color: "oklch(0.72 0.2 50)",
    bg: "oklch(0.72 0.2 50 / 0.1)",
    border: "oklch(0.72 0.2 50 / 0.25)",
  },
]

export function PaymentMethods() {
  return (
    <section id="pagos" className="py-16 px-4 md:px-8" style={{ backgroundColor: "oklch(1 0 0)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "oklch(0.72 0.2 50)" }}>
            Facilitamos tu compra
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
            Medios de pago
          </h2>
          <p className="mt-3 text-base max-w-md mx-auto leading-relaxed" style={{ color: "oklch(0.5 0 0)" }}>
            Aceptamos múltiples formas de pago para que comprar sea fácil y conveniente.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {methods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.title}
                className="rounded-2xl p-6 flex flex-col gap-4 border transition-all hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: method.bg,
                  borderColor: method.border,
                }}
              >
                <div
                  className="rounded-xl w-11 h-11 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: method.color }}
                >
                  <Icon size={20} style={{ color: "oklch(1 0 0)" }} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold leading-tight" style={{ color: "oklch(0.2 0.02 270)" }}>
                    {method.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0 0)" }}>
                    {method.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Nota inferior */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Para consultar datos bancarios o coordinar el pago escribinos por{" "}
          <a
            href="https://wa.me/5493454289474"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.6 0.22 5)" }}
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  )
}
