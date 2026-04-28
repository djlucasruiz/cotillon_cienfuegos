"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { categories, type Product } from "@/lib/products"
import { getProductsFromDB } from "@/lib/products-store"
import { ProductCard } from "@/components/product-card"

interface CatalogProps {
  onAddToCart: (product: Product, quantity?: number) => void
}

export function Catalog({ onAddToCart }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProductsFromDB().then(setProducts)
  }, [])

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "todos" || p.category === selectedCategory
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="categorias" className="py-14 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(0.6 0.22 5)" }}>
            Nuestros productos
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: "oklch(0.2 0.02 270)" }}>
            Catálogo de artículos
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto leading-relaxed" style={{ color: "oklch(0.5 0.03 270)" }}>
            Encontrá todo lo que necesitás para tu próxima fiesta. Más de 500 artículos disponibles.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "oklch(0.55 0.03 270)" }}
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full pl-11 pr-4 py-3 text-sm border outline-none transition-all focus:ring-2"
            style={{
              backgroundColor: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.03 90)",
              color: "oklch(0.2 0.02 270)",
            }}
            aria-label="Buscar productos"
          />
        </div>

        {/* Categories */}
        <div id="productos" className="flex flex-wrap justify-center gap-2 mb-8">
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

        {/* Results info */}
        <p className="text-xs mb-5 text-center" style={{ color: "oklch(0.55 0.03 270)" }}>
          {filtered.length} {filtered.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={(p, qty) => onAddToCart(p, qty)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3" role="img" aria-label="Sin resultados">
              🔍
            </p>
            <p className="font-semibold" style={{ color: "oklch(0.2 0.02 270)" }}>
              No encontramos productos
            </p>
            <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.03 270)" }}>
              Intentá con otra búsqueda o categoría
            </p>
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
  )
}
