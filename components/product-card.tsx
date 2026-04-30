'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { type Product, formatPrice } from '@/lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false)

  function handleAdd() {
    onAddToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.article
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(92,30,250,0.3)' }}
      transition={{ duration: 0.3 }}
      className="bg-[#1C1630] border border-[rgba(139,92,246,0.15)] rounded-[1.25rem] overflow-hidden flex flex-col"
    >
      <div className="aspect-square bg-[#2a0a5e] overflow-hidden">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.imageAlt || product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8B5CF6] mb-1">
          {product.category.replace(/-/g, ' ')}
        </p>
        <h3 className="font-semibold text-[#F8F4FF] text-base mb-3 leading-snug flex-1">
          {product.name}
        </h3>
        <p className="text-2xl font-black text-[#FFD700] mb-4">
          {formatPrice(product.price)}
        </p>
        <button
          onClick={handleAdd}
          className="w-full py-3 rounded-full font-semibold text-sm text-white transition-opacity duration-200 hover:opacity-90"
          style={{
            background: added
              ? 'linear-gradient(to right, #16a34a, #15803d)'
              : 'linear-gradient(to right, #5C1EFA, #FF2D78)',
          }}
        >
          {added ? '✓ Agregado' : '+ Agregar al carrito'}
        </button>
      </div>
    </motion.article>
  )
}
