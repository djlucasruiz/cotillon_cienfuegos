"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Phone, MapPin, Star, User, LogOut, ChevronDown, Settings, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { getRetailSession, logoutRetailClient } from "@/lib/retail-store"

interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
}

export function Header({ cartCount, onCartOpen }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [session, setSession] = useState<{ id: string; name: string; email: string } | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSession(getRetailSession())
  }, [])

  useEffect(() => {
    function handleOpenAuth() { setAuthOpen(true) }
    document.addEventListener("open-auth-modal", handleOpenAuth)
    return () => document.removeEventListener("open-auth-modal", handleOpenAuth)
  }, [])

  // Cerrar menú usuario al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleLogout() {
    logoutRetailClient()
    setSession(null)
    setUserMenuOpen(false)
  }

  function handleSessionChange() {
    setSession(getRetailSession())
  }

  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Productos", href: "#productos" },
    { label: "Categorías", href: "#categorias" },
    { label: "Ofertas", href: "#ofertas" },
    { label: "Mayoristas", href: "/mayoristas/login" },
    { label: "Contacto", href: "#contacto" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-sm" style={{ backgroundColor: "oklch(1 0 0)", borderBottom: "1px solid oklch(0.9 0 0)" }}>
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs" style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0 / 0.92)" }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              San Lorenzo Oeste 325, Concordia, Entre Ríos
            </span>
            <span className="flex items-center gap-1">
              <Phone size={11} />
              345 428-9474
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={11} className="fill-current" style={{ color: "oklch(0.78 0.14 82)" }} />
            <span>Lun–Sáb: 09:00–13:00 · 16:30–20:30</span>
            <span className="opacity-40">·</span>
            <span>Envíos a todo el país</span>
          </div>
        </div>

        {/* Main navbar */}
        <nav className="flex items-center justify-between px-4 md:px-8 py-2 gap-4">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center shrink-0">
            <Image
              src="/logo.jpg"
              unoptimized
              alt="Cotillón Cienfuegos Concordia"
              width={120}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium transition-opacity hover:opacity-60"
                  style={{ color: "oklch(0.25 0.02 250)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Acciones */}
          <div className="flex items-center gap-2">

            {/* Botón admin */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all hover:opacity-80"
              style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.45 0.03 270)", backgroundColor: "oklch(0.98 0 0)" }}
              aria-label="Panel admin"
            >
              <Settings size={13} />
              Admin
            </Link>

            {/* Usuario minorista */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: "oklch(0.38 0.12 248 / 0.4)", color: "oklch(0.38 0.12 248)", backgroundColor: "oklch(0.38 0.12 248 / 0.06)" }}
                >
                  <User size={14} />
                  <span className="hidden sm:inline max-w-[100px] truncate">{session.name.split(" ")[0]}</span>
                  <ChevronDown size={13} />
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-lg overflow-hidden z-50"
                    style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "oklch(0.93 0 0)" }}>
                      <p className="text-xs font-bold truncate" style={{ color: "oklch(0.2 0.02 270)" }}>{session.name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "oklch(0.6 0 0)" }}>{session.email}</p>
                    </div>
                    <Link
                      href="/pedidos"
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-opacity hover:opacity-70 border-b"
                      style={{ borderColor: "oklch(0.93 0 0)", color: "oklch(0.38 0.12 248)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package size={14} />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-opacity hover:opacity-70"
                      style={{ color: "oklch(0.55 0.2 5)" }}
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: "oklch(0.38 0.12 248 / 0.5)", color: "oklch(0.38 0.12 248)", backgroundColor: "oklch(0.38 0.12 248 / 0.05)" }}
              >
                <User size={14} />
                Ingresar
              </button>
            )}

            {/* Carrito */}
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
              aria-label={`Carrito de compras, ${cartCount} artículos`}
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                  style={{ backgroundColor: "oklch(0.78 0.14 82)", color: "oklch(0.15 0.02 250)" }}
                >
                  {cartCount}
                </Badge>
              )}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "oklch(0.25 0.02 250)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 flex flex-col gap-1" style={{ backgroundColor: "oklch(0.98 0 0)", borderColor: "oklch(0.9 0 0)" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium py-2.5 border-b transition-opacity hover:opacity-60"
                style={{ color: "oklch(0.25 0.02 250)", borderColor: "oklch(0.92 0 0)" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {/* Mobile: login/usuario */}
            <div className="flex items-center gap-2 pt-3">
              {session ? (
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href="/pedidos"
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "oklch(0.38 0.12 248)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Package size={14} />
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "oklch(0.55 0.2 5)" }}
                  >
                    <LogOut size={14} />
                    Cerrar sesión ({session.name.split(" ")[0]})
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border"
                  style={{ borderColor: "oklch(0.38 0.12 248 / 0.5)", color: "oklch(0.38 0.12 248)" }}
                >
                  <User size={14} />
                  Iniciar sesión / Registrarse
                </button>
              )}
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold border ml-auto"
                style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0.03 270)" }}
                onClick={() => setMenuOpen(false)}
              >
                <Settings size={13} />
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modal auth minoristas */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSessionChange={handleSessionChange}
      />
    </>
  )
}
