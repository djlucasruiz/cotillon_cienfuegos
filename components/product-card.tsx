"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, CheckCircle2 } from "lucide-react"
import { type Product, formatPrice } from "@/lib/products"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    onAddToCart(product, qty)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setQty(1)
    }, 1500)
  }

  function decrement() {
    setQty((q) => Math.max(1, q - 1))
  }

  function increment() {
    setQty((q) => Math.min(99, q + 1))
  }

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold shadow"
            style={{ backgroundColor: product.badgeColor || "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
          >
            {product.badge}
          </span>
        )}
        {/* Cantidad badge visible siempre */}
        {qty > 1 && (
          <span
            className="absolute top-3 right-3 rounded-full w-7 h-7 flex items-center justify-center text-xs font-extrabold shadow-md"
            style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
          >
            {qty}
          </span>
        )}
      </div>

      {/* Content */}
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

        {/* Precio unitario + total si qty > 1 */}
        <div className="flex flex-col mb-3">
          <span className="text-lg font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
            {formatPrice(product.price)}
          </span>
          {qty > 1 && (
            <span className="text-xs font-semibold" style={{ color: "oklch(0.38 0.12 248)" }}>
              Total: {formatPrice(product.price * qty)}
            </span>
          )}
        </div>

        {/* Selector de cantidad + botón */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Selector */}
          <div
            className="flex items-center rounded-xl border overflow-hidden"
            style={{ borderColor: "oklch(0.88 0.03 90)" }}
          >
            <button
              onClick={decrement}
              disabled={qty <= 1}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-30"
              style={{ color: "oklch(0.3 0.02 270)" }}
              aria-label="Reducir cantidad"
            >
              <Minus size={13} />
            </button>
            <span
              className="w-8 text-center text-sm font-bold select-none"
              style={{ color: "oklch(0.2 0.02 270)" }}
            >
              {qty}
            </span>
            <button
              onClick={increment}
              disabled={qty >= 99}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-30"
              style={{ color: "oklch(0.3 0.02 270)" }}
              aria-label="Aumentar cantidad"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Botón agregar */}
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
              : <><ShoppingCart size={14} /> Agregar</>
            }
          </button>
        </div>
      </div>
    </article>
  )
}
