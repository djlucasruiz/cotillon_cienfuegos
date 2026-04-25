import { products as defaultProducts, type Product } from "@/lib/products"

const PRODUCTS_KEY = "cc_products"

export function getProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return defaultProducts
    const saved: Product[] = JSON.parse(raw)
    // Merge: productos guardados tienen prioridad sobre los default
    const savedMap = new Map(saved.map((p) => [p.id, p]))
    return defaultProducts.map((p) => savedMap.get(p.id) ?? p).concat(
      saved.filter((p) => !defaultProducts.find((d) => d.id === p.id))
    )
  } catch {
    return defaultProducts
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function resetProducts(): void {
  localStorage.removeItem(PRODUCTS_KEY)
}
