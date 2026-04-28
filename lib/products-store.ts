import { products as defaultProducts, categories as defaultCategories, type Product, type Category } from "@/lib/products"

// ─── Productos desde Supabase ─────────────────────────────────────────────────

export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products")
    if (!res.ok) return defaultProducts
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return defaultProducts
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category || "todos",
      image: p.image || "",
      imageAlt: p.image_alt || p.name,
      badge: p.badge,
      badgeColor: p.badge_color,
      featured: p.featured || false,
      colors: p.colors || [],
      features: p.features || [],
    }))
  } catch {
    return defaultProducts
  }
}

export async function getCategoriesFromDB(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories")
    if (!res.ok) return defaultCategories
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return defaultCategories
    return data
  } catch {
    return defaultCategories
  }
}

// Keep localStorage functions for backwards compatibility
const PRODUCTS_KEY = "cc_products"
const CATEGORIES_KEY = "cc_categories"

export function getProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return defaultProducts
    const saved: Product[] = JSON.parse(raw)
    const savedMap = new Map(saved.map((p) => [p.id, p]))
    return defaultProducts
      .map((p) => savedMap.get(p.id) ?? p)
      .concat(saved.filter((p) => !defaultProducts.find((d) => d.id === p.id)))
  } catch {
    return defaultProducts
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  // Also save to Supabase
  products.forEach(async (p) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.image,
        image_alt: p.imageAlt,
        badge: p.badge,
        badge_color: p.badgeColor,
        featured: p.featured,
        colors: p.colors || [],
        features: p.features || [],
      })
    })
  })
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  // Also save to Supabase
  categories.forEach(async (c, i) => {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, sort_order: i })
    })
  })
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) return defaultCategories
    return JSON.parse(raw)
  } catch {
    return defaultCategories
  }
}

export function resetProducts(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PRODUCTS_KEY)
}
