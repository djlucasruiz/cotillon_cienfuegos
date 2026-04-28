"use client"

import { Sparkles, Truck, ShieldCheck, Clock } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden py-14 md:py-20 px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.6 0.22 5 / 0.08) 0%, oklch(0.72 0.2 50 / 0.10) 50%, oklch(0.92 0.12 90 / 0.18) 100%)",
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-8 right-10 w-40 h-40 rounded-full opacity-10 -z-10"
        style={{ backgroundColor: "oklch(0.6 0.22 5)" }}
      />
      <div
        className="absolute bottom-4 left-8 w-28 h-28 rounded-full opacity-10 -z-10"
        style={{ backgroundColor: "oklch(0.72 0.2 50)" }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
              style={{ backgroundColor: "oklch(0.92 0.12 90)", color: "oklch(0.2 0.02 270)" }}
            >
              <Sparkles size={13} />
              Tu tienda de fiestas en Concordia
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-4">
              <span style={{ color: "oklch(0.6 0.22 5)" }}>Todo para</span>
              <br />
              <span style={{ color: "oklch(0.2 0.02 270)" }}>tu fiesta perfecta</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto md:mx-0" style={{ color: "oklch(0.45 0.03 270)" }}>
              Globos, cotillón, disfraces, artículos de cumpleaños, casamientos y más. Los mejores precios de Concordia, Entre Ríos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#productos"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
              >
                Ver productos
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: "oklch(0.6 0.22 5)", color: "oklch(0.6 0.22 5)", backgroundColor: "transparent" }}
              >
                Contactarnos
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 w-full max-w-md">
            <div className="flex-1 w-full max-w-lg mx-auto">
            <Carousel />
          </div>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Envío a domicilio", sub: "Toda Concordia" },
            { icon: ShieldCheck, label: "Productos de calidad", sub: "Garantía total" },
            { icon: Clock, label: "Atención rápida", sub: "Lunes a sábado" },
            { icon: Sparkles, label: "Variedad única", sub: "+500 artículos" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl p-4 shadow-sm"
              style={{ backgroundColor: "oklch(1 0 0)" }}
            >
              <div
                className="flex-shrink-0 rounded-xl p-2"
                style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.1)" }}
              >
                <Icon size={20} style={{ color: "oklch(0.6 0.22 5)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>{label}</p>
                <p className="text-xs" style={{ color: "oklch(0.55 0.03 270)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
