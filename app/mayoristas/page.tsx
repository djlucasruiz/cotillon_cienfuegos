"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LogOut, ShoppingCart, Tag, Package, MessageCircle,
  Building2, User, Phone, BadgePercent, Search
} from "lucide-react"
import { getWholesaleSession, wholesaleLogout, type WholesaleClient } from "@/lib/wholesale-store"
import { getProductsFromDB, getCategoriesFromDB } from "@/lib/products-store"
import { formatPrice, type Product, type Category } from "@/lib/products"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/cart-drawer"

export default function WholesalePage() {
  const router = useRouter()
  const [client, setClient] = useState<WholesaleClient | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [selectedCat, setSelectedCat] = useState("todos")
  const [cartOpen, setCartOpen] = useState(false)
  const { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()

  useEffect(() => {
    const session = getWholesaleSession()
    if (!session) {
      router.replace("/mayoristas/login")
      return
    }
    setClient(session)
    getProductsFromDB().then(setProducts)
    getCategoriesFromDB().then(setCategories)
  }, [router])

  function handleLogout() {
    wholesaleLogout()
    router.replace("/mayoristas/login")
  }

  function wholesalePrice(price: number): number {
    if (!client) return price
    return Math.round(price * (1 - client.discount / 100))
  }

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === "todos" || p.category === selectedCat
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (!client) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.97 0 0)" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b px-4 md:px-8 py-3 flex items-center justify-between gap-4"
        style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Cotillón Cienfuegos" width={80} height={40} className="object-contain" />
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.1)", color: "oklch(0.38 0.12 248)" }}
          >
            <Building2 size={12} />
            Mayoristas
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Info cliente */}
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-bold" style={{ color: "oklch(0.2 0.02 250)" }}>{client.businessName}</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>{client.discount}% de descuento</p>
          </div>

          {/* Carrito */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: "oklch(0.78 0.14 82)", color: "oklch(0.15 0.02 250)" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:opacity-70"
            style={{ color: "oklch(0.5 0 0)" }}
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* Bienvenida */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border"
          style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.06)", borderColor: "oklch(0.38 0.12 248 / 0.2)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.12)" }}
            >
              <Building2 size={24} style={{ color: "oklch(0.38 0.12 248)" }} />
            </div>
            <div>
              <p className="text-lg font-extrabold" style={{ color: "oklch(0.15 0.02 250)" }}>
                Bienvenido, {client.businessName}
              </p>
              <p className="text-sm" style={{ color: "oklch(0.45 0 0)" }}>
                {client.ownerName} · {client.city} · {client.businessType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-2xl px-5 py-3 border"
              style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
            >
              <BadgePercent size={20} style={{ color: "oklch(0.38 0.12 248)" }} />
              <div>
                <p className="text-2xl font-extrabold leading-none" style={{ color: "oklch(0.38 0.12 248)" }}>
                  {client.discount}%
                </p>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0 0)" }}>descuento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.6 0 0)" }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none"
              style={{ borderColor: "oklch(0.88 0 0)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.15 0.02 250)" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className="rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-80 whitespace-nowrap"
                style={
                  selectedCat === cat.id
                    ? { backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }
                    : { backgroundColor: "oklch(1 0 0)", color: "oklch(0.4 0 0)", border: "1px solid oklch(0.88 0 0)" }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const wPrice = wholesalePrice(product.price)
            const saving = product.price - wPrice
            return (
              <div
                key={product.id}
                className="rounded-2xl border overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
              >
                <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: "oklch(0.96 0 0)" }}>
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge descuento */}
                  <div
                    className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
                  >
                    -{client.discount}%
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="text-xs font-bold leading-snug line-clamp-2" style={{ color: "oklch(0.2 0.02 250)" }}>
                    {product.name}
                  </p>

                  <div className="mt-auto flex flex-col gap-0.5">
                    <p className="text-xs line-through" style={{ color: "oklch(0.65 0 0)" }}>
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-base font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>
                      {formatPrice(wPrice)}
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.55 0.1 145)" }}>
                      Ahorrás {formatPrice(saving)}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart({ ...product, price: wPrice })}
                    className="w-full rounded-xl py-2 text-xs font-bold transition-all hover:opacity-90 mt-1"
                    style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Package size={40} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
            <p className="text-sm font-semibold" style={{ color: "oklch(0.45 0 0)" }}>Sin resultados</p>
          </div>
        )}

        {/* Contacto directo */}
        <div
          className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
          style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 250)" }}>Consultas mayoristas</p>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0 0)" }}>
              Horario: Lun–Sáb 09:00–13:00 y 16:30–20:30
            </p>
          </div>
          <a
            href="https://wa.me/5493454289474"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "oklch(0.55 0.16 145)", color: "oklch(1 0 0)" }}
          >
            <MessageCircle size={16} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
        skipAuthCheck={true}
      />
    </div>
  )
}
