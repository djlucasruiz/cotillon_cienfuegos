"use client"

import { Zap } from "lucide-react"
import { products, type Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

interface FeaturedSectionProps {
  onAddToCart: (product: Product) => void
}

export function FeaturedSection({ onAddToCart }: FeaturedSectionProps) {
  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <section id="ofertas" className="py-14 px-4 md:px-8" style={{ backgroundColor: "oklch(0.96 0.02 90)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-2"
              style={{ backgroundColor: "oklch(0.92 0.12 90)", color: "oklch(0.2 0.02 270)" }}
            >
              <Zap size={12} />
              Destacados
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
              Más vendidos de la semana
            </h2>
          </div>
          <a
            href="#productos"
            className="text-sm font-semibold transition-colors hover:underline"
            style={{ color: "oklch(0.6 0.22 5)" }}
          >
            Ver todo el catálogo →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  )
}
