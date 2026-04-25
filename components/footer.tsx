import { Phone, MapPin, Clock, Instagram, Facebook, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" style={{ backgroundColor: "oklch(0.2 0.02 270)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "oklch(0.72 0.2 50)" }}>
                Cotillón
              </p>
              <p className="text-2xl font-extrabold" style={{ color: "oklch(1 0 0)" }}>
                Cienfuegos
              </p>
              <p className="text-sm font-medium" style={{ color: "oklch(0.75 0 0)" }}>
                Concordia, Entre Ríos
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0 0)" }}>
              Tu tienda de confianza para todos tus eventos especiales. Cotillón, globos, disfraces y mucho más con los mejores precios de Concordia.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/cienfuegoscotillon_concordia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.2)" }}
              >
                <Instagram size={18} style={{ color: "oklch(0.85 0.15 5)" }} />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "oklch(0.58 0.18 240 / 0.2)" }}
              >
                <Facebook size={18} style={{ color: "oklch(0.75 0.15 240)" }} />
              </a>
              <a
                href="mailto:cfuegos157@gmail.com"
                aria-label="Email"
                className="rounded-full p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.2)" }}
              >
                <Mail size={18} style={{ color: "oklch(0.72 0.15 145)" }} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "oklch(0.92 0.12 90)" }}>
              Navegación
            </h3>
            <ul className="flex flex-col gap-2">
              {["Inicio", "Productos", "Categorías", "Ofertas", "Pagos", "Mayoristas", "Instagram", "Contacto"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "oklch(0.65 0 0)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "oklch(0.92 0.12 90)" }}>
              Contacto
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.2 50)" }} />
                <div>
                  <a
                    href="https://maps.app.goo.gl/QTYzmBdnck8zwdBn8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: "oklch(0.85 0 0)" }}
                  >
                    San Lorenzo Oeste 325
                  </a>
                  <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                    Concordia, Entre Ríos, Argentina
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.2 50)" }} />
                <div>
                  <a
                    href="https://wa.me/5493454289474"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: "oklch(0.85 0 0)" }}
                  >
                    345 428-9474
                  </a>
                  <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                    WhatsApp disponible
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.2 50)" }} />
                <div>
                  <a
                    href="mailto:cfuegos157@gmail.com"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: "oklch(0.85 0 0)" }}
                  >
                    cfuegos157@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.2 50)" }} />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.72 0.2 50)" }}>
                    Lun a Sáb
                  </p>
                  <p className="text-sm font-medium" style={{ color: "oklch(0.85 0 0)" }}>
                    09:00 – 13:00
                  </p>
                  <p className="text-sm font-medium" style={{ color: "oklch(0.85 0 0)" }}>
                    16:30 – 20:30
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 border-t text-xs"
          style={{ borderColor: "oklch(1 0 0 / 0.08)", color: "oklch(0.5 0 0)" }}
        >
          <p>© {new Date().getFullYear()} Cotillón Cienfuegos Concordia. Todos los derechos reservados.</p>
          <p>Envíos a todo el país · Concordia, Entre Ríos, Argentina</p>
        </div>
      </div>
    </footer>
  )
}
