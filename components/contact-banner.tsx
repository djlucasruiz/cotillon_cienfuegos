import { MessageCircle, Phone, MapPin, Clock, Mail, Instagram } from "lucide-react"

export function ContactBanner() {
  return (
    <section
      className="py-14 px-4 md:px-8"
      style={{
        background: "linear-gradient(135deg, oklch(0.6 0.22 5) 0%, oklch(0.72 0.2 50) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "oklch(1 0 0 / 0.75)" }}>
          Estamos para ayudarte
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-balance" style={{ color: "oklch(1 0 0)" }}>
          ¿Necesitás asesoramiento?
        </h2>
        <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "oklch(1 0 0 / 0.85)" }}>
          Nuestro equipo te ayuda a armar el cotillón perfecto para tu evento. Bodas, cumpleaños, egresados y más.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/5493454289474"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: "oklch(1 0 0)", color: "oklch(0.6 0.22 5)" }}
          >
            <MessageCircle size={18} />
            Escribinos por WhatsApp
          </a>
          <a
            href="mailto:cfuegos157@gmail.com"
            className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold border-2 transition-all hover:scale-105"
            style={{ borderColor: "oklch(1 0 0)", color: "oklch(1 0 0)" }}
          >
            <Mail size={18} />
            cfuegos157@gmail.com
          </a>
          <a
            href="https://www.instagram.com/cienfuegoscotillon_concordia/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold border-2 transition-all hover:scale-105"
            style={{ borderColor: "oklch(1 0 0)", color: "oklch(1 0 0)" }}
          >
            <Instagram size={18} />
            Seguinos en Instagram
          </a>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: "oklch(1 0 0 / 0.7)" }} />
            <a
              href="https://maps.app.goo.gl/QTYzmBdnck8zwdBn8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline transition-all"
              style={{ color: "oklch(1 0 0 / 0.85)" }}
            >
              San Lorenzo Oeste 325, Concordia
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} style={{ color: "oklch(1 0 0 / 0.7)" }} />
            <a
              href="https://wa.me/5493454289474"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "oklch(1 0 0)" }}
            >
              345 428-9474
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: "oklch(1 0 0 / 0.7)" }} />
            <span className="text-sm font-semibold" style={{ color: "oklch(1 0 0)" }}>
              Lun–Sáb: 09:00–13:00 y 16:30–20:30
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
