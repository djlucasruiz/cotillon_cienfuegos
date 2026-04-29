"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LogOut, ShoppingCart, Building2, BadgePercent,
  Search, Plus, Minus, CheckCircle2, MessageCircle, Package
} from "lucide-react"
import { getWholesaleSession, wholesaleLogout, type WholesaleClient } from "@/lib/wholesale-store"
import { getProductsFromDB } from "@/lib/products-store"
import { categories, formatPrice, type Product } from "@/lib/products"
import { useCart } from "@/hooks/use-cart"
import { CartDrawer } from "@/components/cart-drawer"

// Tarjeta idéntica a ProductCard con precio mayorista
function WholesaleProductCard({
  product,
  discount,
  onAddToCart,
}: {
  product: Product
  discount: number
  onAddToCart: (product: Product, quantity: number) => void
}) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const wPrice = Math.round(product.price * (1 - discount / 100))
  const saving = product.price - wPrice

  function handleAdd() {
    onAddToCart({ ...product, price: wPrice }, qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 1500)
  }

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      {/* Imagen */}
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold shadow"
          style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
        >
          -{discount}%
        </span>
        {product.badge && (
          <span
            className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold shadow"
            style={{ backgroundColor: product.badgeColor || "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
          >
            {product.badge}
          </span>
        )}
        {qty > 1 && !product.badge && (
          <span
            className="absolute top-3 right-3 rounded-full w-7 h-7 flex items-center justify-center text-xs font-extrabold shadow-md"
            style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
          >
            {qty}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "oklch(0.6 0.22 5)" }}>
          {product.category.replace(/-/g, " ")}
        </p>
        <h3 className="text-sm font-bold leading-snug mb-1 text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
          {product.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "oklch(0.55 0.03 270)" }}>
          {product.description}
        </p>

        {/* Precios */}
        <div className="flex flex-col mb-3">
          <span className="text-xs line-through" style={{ color: "oklch(0.65 0 0)" }}>
            {formatPrice(product.price)}
          </span>
          <span className="text-lg font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
            {formatPrice(wPrice)}
          </span>
          <span className="text-xs font-semibold" style={{ color: "oklch(0.55 0.1 145)" }}>
            Ahorrás {formatPrice(saving)}{qty > 1 ? ` · Total: ${formatPrice(wPrice * qty)}` : ""}
          </span>
        </div>

        {/* Selector de cantidad + botón */}
        <div className="flex items-center gap-2 mt-auto">
          <div
            className="flex items-center rounded-xl border overflow-hidden"
            style={{ borderColor: "oklch(0.88 0.03 90)" }}
          >
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-30"
              style={{ color: "oklch(0.3 0.02 270)" }}
              aria-label="Reducir cantidad"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-bold select-none" style={{ color: "oklch(0.2 0.02 270)" }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(q => Math.min(99, q + 1))}
              disabled={qty >= 99}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-30"
              style={{ color: "oklch(0.3 0.02 270)" }}
              aria-label="Aumentar cantidad"
            >
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105 hover:shadow-md"
            style={{
              backgroundColor: added ? "oklch(0.55 0.18 145)" : "oklch(0.38 0.12 248)",
              color: "oklch(1 0 0)",
            }}
            aria-label={`Agregar ${qty} ${product.name} al carrito`}
          >
            {added
              ? <><CheckCircle2 size={14} /> Agregado</>
              : <><ShoppingCart size={14} /> Agregar</>}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function WholesalePage() {
  const router = useRouter()
  const [client, setClient] = useState<WholesaleClient | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [search, setSearch] = useState("")
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
  }, [router])

  function handleAddToCart(product: Product, quantity = 1) {
    addToCart(product, quantity)
    setCartOpen(true)
  }

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "todos" || p.category === selectedCategory
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!client) return null

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header mayoristas */}
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
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-bold" style={{ color: "oklch(0.2 0.02 250)" }}>{client.businessName}</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>{client.discount}% de descuento</p>
          </div>

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
                style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => { wholesaleLogout(); router.replace("/mayoristas/login") }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:opacity-70"
            style={{ color: "oklch(0.5 0 0)" }}
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Banner bienvenida */}
        <div className="px-4 md:px-8 pt-6 max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-5 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border"
            style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.06)", borderColor: "oklch(0.38 0.12 248 / 0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2.5" style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.12)" }}>
                <Building2 size={20} style={{ color: "oklch(0.38 0.12 248)" }} />
              </div>
              <div>
                <p className="text-base font-extrabold" style={{ color: "oklch(0.15 0.02 250)" }}>
                  Bienvenido, {client.businessName}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.45 0 0)" }}>
                  {client.ownerName} · {client.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-4 py-2 border" style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.9 0 0)" }}>
              <BadgePercent size={18} style={{ color: "oklch(0.38 0.12 248)" }} />
              <span className="text-xl font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>{client.discount}%</span>
              <span className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>descuento</span>
            </div>
          </div>
        </div>

        {/* Catálogo — layout idéntico a catalog.tsx */}
        <section className="py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">

            {/* Título */}
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(0.6 0.22 5)" }}>
                Precios mayoristas
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
                Catálogo con descuento
              </h2>
              <p className="mt-3 text-sm max-w-md mx-auto leading-relaxed" style={{ color: "oklch(0.5 0.03 270)" }}>
                Todos los precios ya incluyen tu {client.discount}% de descuento mayorista.
              </p>
            </div>

            {/* Búsqueda */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.55 0.03 270)" }} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full pl-11 pr-4 py-3 text-sm border outline-none transition-all focus:ring-2"
                style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.2 0.02 270)" }}
                aria-label="Buscar productos"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full px-4 py-2 text-xs font-semibold transition-all hover:scale-105"
                  style={
                    selectedCategory === cat.id
                      ? { backgroundColor: cat.color, color: "oklch(1 0 0)", boxShadow: "0 2px 8px oklch(0 0 0 / 0.15)" }
                      : { backgroundColor: "oklch(1 0 0)", color: "oklch(0.4 0.03 270)", border: "1.5px solid oklch(0.88 0.03 90)" }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Contador */}
            <p className="text-xs mb-5 text-center" style={{ color: "oklch(0.55 0.03 270)" }}>
              {filtered.length} {filtered.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product) => (
                  <WholesaleProductCard
                    key={product.id}
                    product={product}
                    discount={client.discount}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-3" role="img" aria-label="Sin resultados">🔍</p>
                <p className="font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>No encontramos productos</p>
                <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.03 270)" }}>Intentá con otra búsqueda o categoría</p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("todos") }}
                  className="mt-4 rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contacto */}
        <div className="px-4 md:px-8 pb-10 max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
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
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        skipAuthCheck={true}
      />
    </div>
  )
}
