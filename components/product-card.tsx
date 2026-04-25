"use client"

import { ShoppingCart, Plus } from "lucide-react"
import { type Product, formatPrice } from "@/lib/products"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
        {/* Quick add button on hover */}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-3 right-3 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "oklch(0.6 0.22 5)" }}>
          {product.category.replace("-", " ")}
        </p>
        <h3 className="text-sm font-bold leading-snug mb-1 text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
          {product.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "oklch(0.55 0.03 270)" }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-extrabold" style={{ color: "oklch(0.2 0.02 270)" }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105 hover:shadow-md"
            style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <ShoppingCart size={14} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
