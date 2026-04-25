"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Lock, User, Building2 } from "lucide-react"
import { wholesaleLogin } from "@/lib/wholesale-store"

export default function WholesaleLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      const client = wholesaleLogin(form.username.trim(), form.password)
      if (client) {
        router.replace("/mayoristas")
      } else {
        setError("Usuario o contraseña incorrectos, o cuenta desactivada.")
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "oklch(0.97 0 0)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-sm border"
        style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
      >
        {/* Logo y título */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            src="/logo.jpg"
            alt="Cotillón Cienfuegos"
            width={100}
            height={50}
            className="object-contain"
          />
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold mb-2"
              style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.1)", color: "oklch(0.38 0.12 248)" }}
            >
              <Building2 size={12} />
              Zona Mayoristas
            </div>
            <h1 className="text-xl font-extrabold" style={{ color: "oklch(0.15 0.02 250)" }}>
              Ingresá a tu cuenta
            </h1>
            <p className="text-sm mt-1" style={{ color: "oklch(0.55 0 0)" }}>
              Accedé a precios y condiciones especiales
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Usuario */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.02 250)" }}>
              Usuario
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.6 0 0)" }} />
              <input
                type="text"
                value={form.username}
                onChange={(e) => { setForm(f => ({ ...f, username: e.target.value })); setError("") }}
                placeholder="Tu usuario mayorista"
                autoComplete="username"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm border outline-none transition-all focus:ring-2"
                style={{
                  borderColor: error ? "oklch(0.6 0.22 5)" : "oklch(0.88 0 0)",
                  backgroundColor: "oklch(0.98 0 0)",
                  color: "oklch(0.15 0.02 250)",
                }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.02 250)" }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.6 0 0)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setError("") }}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                className="w-full rounded-xl pl-10 pr-11 py-3 text-sm border outline-none transition-all focus:ring-2"
                style={{
                  borderColor: error ? "oklch(0.6 0.22 5)" : "oklch(0.88 0 0)",
                  backgroundColor: "oklch(0.98 0 0)",
                  color: "oklch(0.15 0.02 250)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "oklch(0.6 0 0)" }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs text-center px-3 py-2 rounded-xl"
              style={{ backgroundColor: "oklch(0.97 0.05 5)", color: "oklch(0.5 0.22 5)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !form.username || !form.password}
            className="flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold mt-1 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Lock size={15} />
            )}
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "oklch(0.92 0 0)" }}>
          <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
            ¿No tenés acceso?{" "}
            <a
              href="/#mayoristas"
              className="font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "oklch(0.38 0.12 248)" }}
            >
              Registrate como mayorista
            </a>
          </p>
        </div>
      </div>

      <a
        href="/"
        className="mt-6 text-xs hover:opacity-70 transition-opacity"
        style={{ color: "oklch(0.55 0 0)" }}
      >
        Volver a la tienda
      </a>
    </div>
  )
}
