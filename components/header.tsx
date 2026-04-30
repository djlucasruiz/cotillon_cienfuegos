'use client'
import { useState, useEffect } from 'react'

interface HeaderProps {
  cartCount?: number
  onCartOpen?: () => void
}

export function Header({ cartCount = 0, onCartOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(13,10,26,0.85)] backdrop-blur-[16px] border-b border-[rgba(139,92,246,0.2)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-2xl text-[#FFD700] tracking-wide no-underline">
          Cienfuegos
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Inicio', href: '#inicio' },
            { label: 'Productos', href: '#categorias' },
            { label: 'Mayoristas', href: '/mayoristas' },
            { label: 'Contacto', href: '#contacto' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[rgba(248,244,255,0.7)] hover:text-[#FFD700] transition-colors duration-200 text-sm font-medium no-underline"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={onCartOpen}
          className="bg-[#FF2D78] hover:bg-[#ff1a66] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 shadow-lg"
        >
          🛒 Carrito ({cartCount})
        </button>
      </div>
    </header>
  )
}
