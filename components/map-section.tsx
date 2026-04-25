"use client"

import { MapPin, Clock, Phone, ExternalLink } from "lucide-react"

export function MapSection() {
  return (
    <section id="ubicacion" className="py-16 px-4 md:px-8" style={{ backgroundColor: "oklch(1 0 0)" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "oklch(0.6 0.22 5)" }}>
            Dónde encontrarnos
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
            Visitanos en el local
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Info lateral */}
          <div className="flex flex-col gap-4">

            {/* Dirección */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: "oklch(0.97 0.015 90)", border: "1px solid oklch(0.88 0.03 90)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full p-2"
                  style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.1)" }}
                >
                  <MapPin size={18} style={{ color: "oklch(0.6 0.22 5)" }} />
                </div>
                <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Dirección</p>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>
                  San Lorenzo Oeste 325
                </p>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.5 0 0)" }}>
                  Concordia, Entre Ríos, Argentina
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/QTYzmBdnck8zwdBn8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70 w-fit"
                style={{ color: "oklch(0.6 0.22 5)" }}
              >
                <ExternalLink size={13} />
                Abrir en Google Maps
              </a>
            </div>

            {/* Horarios */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: "oklch(0.97 0.015 90)", border: "1px solid oklch(0.88 0.03 90)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full p-2"
                  style={{ backgroundColor: "oklch(0.72 0.2 50 / 0.1)" }}
                >
                  <Clock size={18} style={{ color: "oklch(0.72 0.2 50)" }} />
                </div>
                <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Horarios</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.4 0 0)" }}>Lunes a Sábado</span>
                  <div className="flex flex-col items-end gap-0.5">
                    <span
                      className="text-xs font-bold rounded-full px-2.5 py-0.5"
                      style={{ backgroundColor: "oklch(0.72 0.2 50 / 0.12)", color: "oklch(0.55 0.15 50)" }}
                    >
                      09:00 – 13:00
                    </span>
                    <span
                      className="text-xs font-bold rounded-full px-2.5 py-0.5"
                      style={{ backgroundColor: "oklch(0.72 0.2 50 / 0.12)", color: "oklch(0.55 0.15 50)" }}
                    >
                      16:30 – 20:30
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.4 0 0)" }}>Domingo</span>
                  <span
                    className="text-xs font-bold rounded-full px-2.5 py-0.5"
                    style={{ backgroundColor: "oklch(0.88 0 0 / 0.5)", color: "oklch(0.5 0 0)" }}
                  >
                    Cerrado
                  </span>
                </div>
              </div>
            </div>

            {/* Contacto rápido */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: "oklch(0.97 0.015 90)", border: "1px solid oklch(0.88 0.03 90)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full p-2"
                  style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.1)" }}
                >
                  <Phone size={18} style={{ color: "oklch(0.62 0.18 145)" }} />
                </div>
                <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Contacto</p>
              </div>
              <a
                href="https://wa.me/5493454289474"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all hover:scale-105"
                style={{ backgroundColor: "oklch(0.62 0.18 145)", color: "oklch(1 0 0)" }}
              >
                <Phone size={15} />
                345 428-9474
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm"
            style={{ border: "1px solid oklch(0.88 0.03 90)", minHeight: "380px" }}
          >
            <iframe
              title="Ubicación de Cotillón Cienfuegos Concordia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.0!2d-58.0204!3d-31.3927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDIzJzMzLjciUyA1OMKwMDEnMTMuNCJX!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar&q=San+Lorenzo+Oeste+325,+Concordia,+Entre+Rios,+Argentina"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Link externo destacado */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://maps.app.goo.gl/QTYzmBdnck8zwdBn8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold border-2 transition-all hover:scale-105"
            style={{ borderColor: "oklch(0.6 0.22 5)", color: "oklch(0.6 0.22 5)" }}
          >
            <MapPin size={16} />
            Ver ubicación completa en Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
