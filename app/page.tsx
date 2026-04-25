"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedSection } from "@/components/featured-section"
import { Catalog } from "@/components/catalog"
import { CartDrawer } from "@/components/cart-drawer"
import { ContactBanner } from "@/components/contact-banner"
import { PaymentMethods } from "@/components/payment-methods"
import { WholesaleSection } from "@/components/wholesale-section"
import { MapSection } from "@/components/map-section"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { type Product } from "@/lib/products"

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()

  function handleAddToCart(product: Product) {
    addToCart(product)
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Hero />
        <FeaturedSection onAddToCart={handleAddToCart} />
        <Catalog onAddToCart={handleAddToCart} />
        <PaymentMethods />
        <WholesaleSection />
        <MapSection />
        <ContactBanner />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
      />
    </div>
  )
}
