"use client"

import { useState } from "react"
import { Building2, Package, TrendingUp, Users, MessageCircle, CheckCircle2, ChevronRight } from "lucide-react"

interface WholesaleForm {
  businessName: string
  ownerName: string
  phone: string
  email: string
  city: string
  businessType: string
  monthlyVolume: string
  message: string
}

const defaultForm: WholesaleForm = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "",
  businessType: "",
  monthlyVolume: "",
  message: "",
}

const benefits = [
  {
    icon: TrendingUp,
    title: "Precios mayoristas",
    desc: "Accedé a precios preferenciales según tu volumen de compra.",
    color: "oklch(0.6 0.22 5)",
    bg: "oklch(0.6 0.22 5 / 0.08)",
  },
  {
    icon: Package,
    title: "Stock garantizado",
    desc: "Reservas anticipadas y stock prioritario para revendedores.",
    color: "oklch(0.72 0.2 50)",
    bg: "oklch(0.72 0.2 50 / 0.08)",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    desc: "Un asesor dedicado para tu negocio durante todo el año.",
    color: "oklch(0.62 0.18 145)",
    bg: "oklch(0.62 0.18 145 / 0.08)",
  },
  {
    icon: Building2,
    title: "Cuenta corporativa",
    desc: "Facturación, historial de pedidos y condiciones especiales.",
    color: "oklch(0.58 0.18 240)",
    bg: "oklch(0.58 0.18 240 / 0.08)",
  },
]

export function WholesaleSection() {
  const [form, setForm] = useState<WholesaleForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<WholesaleForm>>({})
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate(): boolean {
    const newErrors: Partial<WholesaleForm> = {}
    if (!form.businessName.trim()) newErrors.businessName = "Requerido"
    if (!form.ownerName.trim()) newErrors.ownerName = "Requerido"
    if (!form.phone.trim()) newErrors.phone = "Requerido"
    if (!form.city.trim()) newErrors.city = "Requerido"
    if (!form.businessType) newErrors.businessType = "Requerido"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const lines = [
      `*REGISTRO MAYORISTA — Cotillón Cienfuegos*`,
      ``,
      `*Datos del negocio*`,
      `• Nombre del negocio: ${form.businessName}`,
      `• Responsable: ${form.ownerName}`,
      `• Tipo de negocio: ${form.businessType}`,
      `• Ciudad / Localidad: ${form.city}`,
      ``,
      `*Contacto*`,
      `• Teléfono: ${form.phone}`,
      form.email ? `• Email: ${form.email}` : null,
      ``,
      form.monthlyVolume ? `*Volumen mensual estimado:* ${form.monthlyVolume}` : null,
      form.message ? `*Mensaje adicional:* ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const url = `https://wa.me/5493454289474?text=${encodeURIComponent(lines)}`
    window.open(url, "_blank")
    setSent(true)
  }

  const inputBase =
    "w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition-all focus:ring-2"
  const inputStyle = {
    borderColor: "oklch(0.88 0.03 90)",
    backgroundColor: "oklch(0.98 0.01 90)",
    color: "oklch(0.2 0.02 270)",
  }

  return (
    <section id="mayoristas" className="py-16 px-4 md:px-8" style={{ backgroundColor: "oklch(0.97 0.015 90)" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "oklch(0.6 0.22 5)" }}>
            Canal mayorista
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
            Vendé cotillón con nosotros
          </h2>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: "oklch(0.45 0.02 270)" }}>
            Somos proveedores de kioscos, comercios, organizadores de eventos y revendedores de toda la región.
            Registrate y accedé a condiciones especiales.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {benefits.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: bg, border: `1px solid ${color}20` }}
            >
              <div className="rounded-full w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.5 0 0)" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl p-6 md:p-10 shadow-sm"
            style={{ backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.88 0.03 90)" }}
          >
            {!sent ? (
              <>
                <div className="mb-7">
                  <h3 className="text-xl font-extrabold mb-1" style={{ color: "oklch(0.2 0.02 270)" }}>
                    Formulario de registro
                  </h3>
                  <p className="text-sm" style={{ color: "oklch(0.55 0 0)" }}>
                    Completá tus datos y te contactamos a la brevedad.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Nombre del negocio <span style={{ color: "oklch(0.6 0.22 5)" }}>*</span>
                      </label>
                      <input
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        placeholder="Ej: Kiosco El Sol"
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.businessName && (
                        <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{errors.businessName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Nombre del responsable <span style={{ color: "oklch(0.6 0.22 5)" }}>*</span>
                      </label>
                      <input
                        name="ownerName"
                        value={form.ownerName}
                        onChange={handleChange}
                        placeholder="Tu nombre completo"
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.ownerName && (
                        <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{errors.ownerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Teléfono / WhatsApp <span style={{ color: "oklch(0.6 0.22 5)" }}>*</span>
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Ej: 345 412-3456"
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.phone && (
                        <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{errors.phone}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Email <span style={{ color: "oklch(0.65 0 0)" }}>(opcional)</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className={inputBase}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Ciudad / Localidad <span style={{ color: "oklch(0.6 0.22 5)" }}>*</span>
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Ej: Concordia"
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.city && (
                        <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{errors.city}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                        Tipo de negocio <span style={{ color: "oklch(0.6 0.22 5)" }}>*</span>
                      </label>
                      <select
                        name="businessType"
                        value={form.businessType}
                        onChange={handleChange}
                        className={inputBase}
                        style={inputStyle}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Kiosco">Kiosco</option>
                        <option value="Librería / Papelería">Librería / Papelería</option>
                        <option value="Organizador de eventos">Organizador de eventos</option>
                        <option value="Local de cotillón">Local de cotillón</option>
                        <option value="Revendedor particular">Revendedor particular</option>
                        <option value="Supermercado / Almacén">Supermercado / Almacén</option>
                        <option value="Otro">Otro</option>
                      </select>
                      {errors.businessType && (
                        <p className="text-xs" style={{ color: "oklch(0.6 0.22 5)" }}>{errors.businessType}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                      Volumen mensual estimado <span style={{ color: "oklch(0.65 0 0)" }}>(opcional)</span>
                    </label>
                    <select
                      name="monthlyVolume"
                      value={form.monthlyVolume}
                      onChange={handleChange}
                      className={inputBase}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Menos de $50.000">Menos de $50.000</option>
                      <option value="$50.000 – $150.000">$50.000 – $150.000</option>
                      <option value="$150.000 – $500.000">$150.000 – $500.000</option>
                      <option value="Más de $500.000">Más de $500.000</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: "oklch(0.35 0.02 270)" }}>
                      Mensaje adicional <span style={{ color: "oklch(0.65 0 0)" }}>(opcional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Contanos sobre tu negocio, qué productos te interesan o cualquier consulta..."
                      className={`${inputBase} resize-none`}
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg mt-1"
                    style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                  >
                    <MessageCircle size={18} />
                    Enviar registro por WhatsApp
                    <ChevronRight size={16} />
                  </button>

                  <p className="text-xs text-center leading-relaxed" style={{ color: "oklch(0.6 0 0)" }}>
                    Al enviar, se abre WhatsApp con tu información completa. Te respondemos en el horario de atención.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="rounded-full p-5" style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.12)" }}>
                  <CheckCircle2 size={48} style={{ color: "oklch(0.62 0.18 145)" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xl font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
                    Solicitud enviada
                  </p>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: "oklch(0.5 0 0)" }}>
                    Tu registro fue enviado por WhatsApp. Te contactaremos a la brevedad para confirmar las condiciones mayoristas.
                  </p>
                </div>
                <button
                  onClick={() => { setForm(defaultForm); setSent(false) }}
                  className="rounded-full px-6 py-2.5 text-sm font-bold border-2 transition-all hover:scale-105"
                  style={{ borderColor: "oklch(0.6 0.22 5)", color: "oklch(0.6 0.22 5)" }}
                >
                  Enviar otro registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
