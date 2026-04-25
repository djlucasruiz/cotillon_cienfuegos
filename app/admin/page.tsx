"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Search, Plus, Pencil, Trash2, Save, X,
  ShoppingBag, Package, Tag, Image, RotateCcw, CheckCircle2, ExternalLink, Eye, EyeOff,
  Users, Building2, BadgePercent, ToggleLeft, ToggleRight, Key
} from "lucide-react"
import { isAuthenticated, logout } from "@/lib/auth"
import { getProducts, saveProducts, resetProducts } from "@/lib/products-store"
import { categories, formatPrice, type Product } from "@/lib/products"
import {
  getClients, saveClients, createClient, updateClient, deleteClient,
  type WholesaleClient
} from "@/lib/wholesale-store"

const BADGE_COLORS = [
  { label: "Rosa", value: "oklch(0.6 0.22 5)" },
  { label: "Amarillo", value: "oklch(0.72 0.2 50)" },
  { label: "Verde", value: "oklch(0.62 0.18 145)" },
  { label: "Azul", value: "oklch(0.58 0.18 240)" },
]

function emptyClient(): Omit<WholesaleClient, "id" | "createdAt"> {
  return {
    businessName: "", ownerName: "", username: "", password: "",
    phone: "", email: "", city: "", businessType: "",
    discount: 15, active: true, notes: "",
  }
}

const emptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  description: "",
  price: 0,
  category: "cotillon",
  image: "",
  imageAlt: "",
  badge: "",
  badgeColor: "oklch(0.6 0.22 5)",
  featured: false,
})

function generateId(): string {
  return "prod-" + Math.random().toString(36).slice(2, 9)
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"products" | "wholesale">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("todos")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<Product, "id">>(emptyProduct())
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState("")

  // Mayoristas
  const [clients, setClients] = useState<WholesaleClient[]>([])
  const [editingClient, setEditingClient] = useState<WholesaleClient | null>(null)
  const [isNewClient, setIsNewClient] = useState(false)
  const [clientForm, setClientForm] = useState<Omit<WholesaleClient, "id" | "createdAt">>(emptyClient())
  const [confirmDeleteClient, setConfirmDeleteClient] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login")
      return
    }
    setProducts(getProducts())
    setClients(getClients())
  }, [router])

  function handleLogout() {
    logout()
    router.replace("/admin/login")
  }

  function handleEdit(product: Product) {
    setEditingId(product.id)
    setEditForm({ ...product })
    setPreviewImage(product.image)
    setIsNew(false)
  }

  function handleNew() {
    const newId = generateId()
    setEditingId(newId)
    setEditForm(emptyProduct())
    setPreviewImage("")
    setIsNew(true)
  }

  function handleCancel() {
    setEditingId(null)
    setEditForm(emptyProduct())
    setPreviewImage("")
    setIsNew(false)
  }

  function handleSaveEdit() {
    if (!editForm.name.trim() || editForm.price <= 0) return
    let updated: Product[]
    if (isNew) {
      updated = [...products, { id: editingId!, ...editForm }]
    } else {
      updated = products.map((p) => p.id === editingId ? { id: p.id, ...editForm } : p)
    }
    setProducts(updated)
    saveProducts(updated)
    setEditingId(null)
    setIsNew(false)
    triggerSaved()
  }

  function handleDelete(id: string) {
    const updated = products.filter((p) => p.id !== id)
    setProducts(updated)
    saveProducts(updated)
    setConfirmDelete(null)
    triggerSaved()
  }

  function handleReset() {
    resetProducts()
    setProducts(getProducts())
    triggerSaved()
  }

  function triggerSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "todos" || p.category === filterCat
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.97 0.01 90)" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b px-4 md:px-8 py-4 flex items-center justify-between gap-4"
        style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl p-2"
            style={{ backgroundColor: "oklch(0.6 0.22 5)" }}
          >
            <ShoppingBag size={18} style={{ color: "oklch(1 0 0)" }} />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-none" style={{ color: "oklch(0.2 0.02 270)" }}>
              Panel Admin
            </p>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0 0)" }}>
              Cotillón Cienfuegos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "oklch(0.62 0.18 145 / 0.12)", color: "oklch(0.5 0.18 145)" }}>
              <CheckCircle2 size={13} />
              Guardado
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all hover:opacity-80"
            style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.4 0.03 270)" }}
          >
            <ExternalLink size={13} />
            Ver tienda
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: "oklch(0.97 0.01 90)", color: "oklch(0.5 0.03 270)" }}
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b px-4 md:px-8" style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)" }}>
        <div className="flex gap-1 max-w-6xl mx-auto">
          {[
            { id: "products", label: "Productos", icon: Package },
            { id: "wholesale", label: "Mayoristas", icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as "products" | "wholesale")}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: activeTab === id ? "oklch(0.38 0.12 248)" : "transparent",
                color: activeTab === id ? "oklch(0.38 0.12 248)" : "oklch(0.55 0 0)",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* ── TAB PRODUCTOS ── */}
        {activeTab === "products" && (<>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total productos", value: products.length, color: "oklch(0.6 0.22 5)" },
            { label: "Destacados", value: products.filter(p => p.featured).length, color: "oklch(0.72 0.2 50)" },
            { label: "Con oferta", value: products.filter(p => p.badge).length, color: "oklch(0.62 0.18 145)" },
            { label: "Categorías", value: categories.length - 1, color: "oklch(0.58 0.18 240)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)" }}
            >
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0 0)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.6 0 0)" }} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none"
              style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
            style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
          >
            <Plus size={15} />
            Nuevo producto
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0.03 270)", backgroundColor: "oklch(1 0 0)" }}
            title="Restablecer productos originales"
          >
            <RotateCcw size={14} />
            Restablecer
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)" }}
        >
          {/* Table header */}
          <div
            className="hidden md:grid grid-cols-[80px_1fr_120px_100px_80px_100px] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide border-b"
            style={{ color: "oklch(0.55 0 0)", borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(0.98 0.01 90)" }}
          >
            <span>Foto</span>
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Destacado</span>
            <span>Acciones</span>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
              <p className="text-sm font-semibold" style={{ color: "oklch(0.4 0 0)" }}>Sin productos</p>
              <p className="text-xs mt-1" style={{ color: "oklch(0.65 0 0)" }}>Cambiá el filtro o creá uno nuevo</p>
            </div>
          )}

          {filtered.map((product, idx) => (
            <div key={product.id}>
              {/* Row */}
              <div
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_120px_100px_80px_100px] gap-3 md:gap-4 px-5 py-4 items-start md:items-center border-b last:border-b-0"
                style={{ borderColor: "oklch(0.93 0.01 90)" }}
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0"
                  style={{ borderColor: "oklch(0.88 0.03 90)" }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: "oklch(0.95 0.01 90)" }}>
                      <Image size={18} style={{ color: "oklch(0.7 0 0)" }} />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "oklch(0.2 0.02 270)" }}>{product.name}</p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "oklch(0.55 0 0)" }}>{product.description}</p>
                  {product.badge && (
                    <span
                      className="self-start text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: product.badgeColor + "20", color: product.badgeColor }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Category */}
                <p className="text-xs font-medium" style={{ color: "oklch(0.5 0.03 270)" }}>
                  <span className="md:hidden font-semibold" style={{ color: "oklch(0.3 0 0)" }}>Cat: </span>
                  {catName(product.category)}
                </p>

                {/* Price */}
                <p className="text-sm font-extrabold" style={{ color: "oklch(0.6 0.22 5)" }}>
                  {formatPrice(product.price)}
                </p>

                {/* Featured */}
                <div className="flex items-center gap-1.5">
                  {product.featured ? (
                    <Eye size={14} style={{ color: "oklch(0.62 0.18 145)" }} />
                  ) : (
                    <EyeOff size={14} style={{ color: "oklch(0.75 0 0)" }} />
                  )}
                  <span className="text-xs" style={{ color: product.featured ? "oklch(0.5 0.18 145)" : "oklch(0.7 0 0)" }}>
                    {product.featured ? "Sí" : "No"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all hover:opacity-80"
                    style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.4 0.03 270)", backgroundColor: "oklch(0.98 0.01 90)" }}
                  >
                    <Pencil size={12} />
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(product.id)}
                    className="flex items-center rounded-lg p-1.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: "oklch(0.97 0.05 5)", color: "oklch(0.55 0.22 5)" }}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Confirm delete */}
              {confirmDelete === product.id && (
                <div
                  className="px-5 py-3 flex items-center justify-between gap-3 border-b"
                  style={{ backgroundColor: "oklch(0.99 0.03 5)", borderColor: "oklch(0.93 0.01 90)" }}
                >
                  <p className="text-xs font-medium" style={{ color: "oklch(0.4 0.22 5)" }}>
                    Confirmar eliminacion de <strong>{product.name}</strong>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:opacity-80"
                      style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0 0)", backgroundColor: "oklch(1 0 0)" }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Edit form inline */}
              {editingId === product.id && !isNew && (
                <EditForm
                  form={editForm}
                  setForm={setEditForm}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  onSave={handleSaveEdit}
                  onCancel={handleCancel}
                />
              )}
            </div>
          ))}
        </div>

        {/* New product form */}
        {isNew && editingId && (
          <div
            className="mt-5 rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.6 0.22 5)" }}
          >
            <div
              className="px-5 py-3 flex items-center gap-2 border-b"
              style={{ backgroundColor: "oklch(0.6 0.22 5 / 0.06)", borderColor: "oklch(0.88 0.03 90)" }}
            >
              <Plus size={15} style={{ color: "oklch(0.6 0.22 5)" }} />
              <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>Nuevo producto</p>
            </div>
            <EditForm
              form={editForm}
              setForm={setEditForm}
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
              onSave={handleSaveEdit}
              onCancel={handleCancel}
            />
          </div>
        )}

        <p className="text-xs text-center mt-8" style={{ color: "oklch(0.65 0 0)" }}>
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} · Los cambios se guardan automáticamente y aparecen en la tienda al instante
        </p>
        </>)}

        {/* ── TAB MAYORISTAS ── */}
        {activeTab === "wholesale" && (
          <div className="flex flex-col gap-6">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>
                  Clientes mayoristas
                </p>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0 0)" }}>
                  Administrá los accesos y descuentos de cada cliente.
                </p>
              </div>
              <button
                onClick={() => { setIsNewClient(true); setEditingClient(null); setClientForm(emptyClient()) }}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
                style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
              >
                <Plus size={15} />
                Nuevo cliente
              </button>
            </div>

            {/* Formulario nuevo cliente */}
            {isNewClient && (
              <ClientForm
                form={clientForm}
                setForm={setClientForm}
                onSave={() => {
                  const c = createClient(clientForm)
                  setClients(getClients())
                  setIsNewClient(false)
                  triggerSaved()
                }}
                onCancel={() => setIsNewClient(false)}
                title="Nuevo cliente mayorista"
              />
            )}

            {/* Lista de clientes */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.88 0.03 90)" }}
            >
              {/* Header tabla */}
              <div
                className="hidden md:grid grid-cols-[1fr_130px_100px_80px_80px_120px] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide border-b"
                style={{ color: "oklch(0.55 0 0)", borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(0.98 0.01 90)" }}
              >
                <span>Cliente</span>
                <span>Usuario</span>
                <span>Ciudad</span>
                <span>Descuento</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>

              {clients.length === 0 && (
                <div className="py-16 text-center">
                  <Users size={36} className="mx-auto mb-3" style={{ color: "oklch(0.75 0 0)" }} />
                  <p className="text-sm font-semibold" style={{ color: "oklch(0.4 0 0)" }}>Sin clientes mayoristas</p>
                  <p className="text-xs mt-1" style={{ color: "oklch(0.65 0 0)" }}>Agregá el primer cliente con el botón de arriba</p>
                </div>
              )}

              {clients.map((client) => (
                <div key={client.id}>
                  <div
                    className="grid grid-cols-1 md:grid-cols-[1fr_130px_100px_80px_80px_120px] gap-3 md:gap-4 px-5 py-4 items-start md:items-center border-b last:border-b-0"
                    style={{ borderColor: "oklch(0.93 0.01 90)" }}
                  >
                    {/* Info */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>{client.businessName}</p>
                      <p className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>{client.ownerName} · {client.phone}</p>
                      {client.notes && (
                        <p className="text-xs italic" style={{ color: "oklch(0.65 0 0)" }}>{client.notes}</p>
                      )}
                    </div>
                    {/* Usuario */}
                    <div className="flex items-center gap-1.5">
                      <Key size={12} style={{ color: "oklch(0.65 0 0)" }} />
                      <p className="text-xs font-mono" style={{ color: "oklch(0.35 0.02 270)" }}>{client.username}</p>
                    </div>
                    {/* Ciudad */}
                    <p className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>{client.city}</p>
                    {/* Descuento */}
                    <div className="flex items-center gap-1">
                      <BadgePercent size={13} style={{ color: "oklch(0.38 0.12 248)" }} />
                      <p className="text-sm font-extrabold" style={{ color: "oklch(0.38 0.12 248)" }}>{client.discount}%</p>
                    </div>
                    {/* Toggle activo */}
                    <button
                      onClick={() => {
                        updateClient(client.id, { active: !client.active })
                        setClients(getClients())
                      }}
                      aria-label={client.active ? "Desactivar cliente" : "Activar cliente"}
                    >
                      {client.active
                        ? <ToggleRight size={24} style={{ color: "oklch(0.55 0.18 145)" }} />
                        : <ToggleLeft size={24} style={{ color: "oklch(0.7 0 0)" }} />
                      }
                    </button>
                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingClient(client); setClientForm({ ...client }); setIsNewClient(false) }}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all hover:opacity-80"
                        style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.4 0.03 270)", backgroundColor: "oklch(0.98 0.01 90)" }}
                      >
                        <Pencil size={12} />
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteClient(client.id)}
                        className="flex items-center rounded-lg p-1.5 transition-all hover:opacity-80"
                        style={{ backgroundColor: "oklch(0.97 0.05 5)", color: "oklch(0.55 0.22 5)" }}
                        aria-label="Eliminar cliente"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Confirmar eliminación */}
                  {confirmDeleteClient === client.id && (
                    <div
                      className="px-5 py-3 flex items-center justify-between gap-3 border-b"
                      style={{ backgroundColor: "oklch(0.99 0.03 5)", borderColor: "oklch(0.93 0.01 90)" }}
                    >
                      <p className="text-xs font-medium" style={{ color: "oklch(0.4 0.22 5)" }}>
                        Eliminar a <strong>{client.businessName}</strong>. Esta accion no se puede deshacer.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { deleteClient(client.id); setClients(getClients()); setConfirmDeleteClient(null) }}
                          className="rounded-lg px-3 py-1.5 text-xs font-bold"
                          style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteClient(null)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold border"
                          style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0 0)", backgroundColor: "oklch(1 0 0)" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form edición inline */}
                  {editingClient?.id === client.id && (
                    <ClientForm
                      form={clientForm}
                      setForm={setClientForm}
                      onSave={() => {
                        updateClient(client.id, clientForm)
                        setClients(getClients())
                        setEditingClient(null)
                        triggerSaved()
                      }}
                      onCancel={() => setEditingClient(null)}
                      title="Editar cliente"
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 border text-xs"
              style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.05)", borderColor: "oklch(0.38 0.12 248 / 0.2)", color: "oklch(0.45 0 0)" }}
            >
              Los clientes mayoristas acceden desde <strong>/mayoristas/login</strong> con su usuario y contraseña.
              Ven los precios con el descuento aplicado y pueden hacer pedidos por WhatsApp.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Formulario cliente mayorista ────────────────────────────────────────────
interface ClientFormProps {
  form: Omit<WholesaleClient, "id" | "createdAt">
  setForm: (f: Omit<WholesaleClient, "id" | "createdAt">) => void
  onSave: () => void
  onCancel: () => void
  title: string
}

function ClientForm({ form, setForm, onSave, onCancel, title }: ClientFormProps) {
  const f = (key: keyof typeof form, value: string | number | boolean) =>
    setForm({ ...form, [key]: value })

  const isValid = form.businessName.trim() !== "" && form.username.trim() !== "" && form.password.trim() !== ""

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
  const inputStyle = { borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.38 0.12 248 / 0.4)" }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ backgroundColor: "oklch(0.38 0.12 248 / 0.06)", borderColor: "oklch(0.88 0.03 90)" }}
      >
        <Building2 size={15} style={{ color: "oklch(0.38 0.12 248)" }} />
        <p className="text-sm font-bold" style={{ color: "oklch(0.2 0.02 270)" }}>{title}</p>
      </div>
      <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "businessName", label: "Nombre del negocio *", placeholder: "Ej: Kiosco El Sol" },
          { key: "ownerName", label: "Responsable *", placeholder: "Nombre completo" },
          { key: "username", label: "Usuario *", placeholder: "Ej: kioscoelsol" },
          { key: "password", label: "Contraseña *", placeholder: "Mínimo 6 caracteres" },
          { key: "phone", label: "Teléfono", placeholder: "345 412-3456" },
          { key: "email", label: "Email", placeholder: "email@ejemplo.com" },
          { key: "city", label: "Ciudad", placeholder: "Concordia" },
          { key: "businessType", label: "Tipo de negocio", placeholder: "Kiosco, Librería..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
              {label}
            </label>
            <input
              type="text"
              value={String(form[key as keyof typeof form] ?? "")}
              onChange={(e) => f(key as keyof typeof form, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Descuento */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Descuento (%) *
          </label>
          <input
            type="number"
            min={0}
            max={60}
            value={form.discount}
            onChange={(e) => f("discount", Number(e.target.value))}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Notas internas
          </label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => f("notes", e.target.value)}
            placeholder="Observaciones del cliente..."
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Activo */}
        <div className="flex items-center gap-3 md:col-span-2">
          <button
            type="button"
            onClick={() => f("active", !form.active)}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{ backgroundColor: form.active ? "oklch(0.55 0.18 145)" : "oklch(0.82 0 0)" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
              style={{
                left: form.active ? "calc(100% - 22px)" : "2px",
                backgroundColor: "oklch(1 0 0)",
                boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)"
              }}
            />
          </button>
          <label className="text-sm font-medium" style={{ color: "oklch(0.35 0.02 270)" }}>
            Cuenta activa
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 pb-5 pt-2 border-t" style={{ borderColor: "oklch(0.88 0.03 90)" }}>
        <button
          onClick={onSave}
          disabled={!isValid}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: "oklch(0.38 0.12 248)", color: "oklch(1 0 0)" }}
        >
          <Save size={14} />
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0.03 270)", backgroundColor: "oklch(1 0 0)" }}
        >
          <X size={14} />
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Formulario de edición ───────────────────────────────────────────────────
interface EditFormProps {
  form: Omit<Product, "id">
  setForm: (f: Omit<Product, "id">) => void
  previewImage: string
  setPreviewImage: (url: string) => void
  onSave: () => void
  onCancel: () => void
}

function EditForm({ form, setForm, previewImage, setPreviewImage, onSave, onCancel }: EditFormProps) {
  function field(key: keyof Omit<Product, "id">, value: string | number | boolean) {
    setForm({ ...form, [key]: value })
  }

  const isValid = form.name.trim() !== "" && form.price > 0

  return (
    <div className="px-5 py-6" style={{ backgroundColor: "oklch(0.99 0.01 90)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Nombre del producto *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
            placeholder="Ej: Pack Globos Metalizados x10"
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Precio (ARS) *
          </label>
          <input
            type="number"
            min={0}
            value={form.price === 0 ? "" : form.price}
            onChange={(e) => field("price", Number(e.target.value))}
            placeholder="Ej: 2500"
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => field("description", e.target.value)}
            rows={2}
            placeholder="Descripción breve del producto..."
            className="rounded-xl px-4 py-2.5 text-sm border outline-none resize-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          />
        </div>

        {/* URL de imagen */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            URL de la foto
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.image}
              onChange={(e) => { field("image", e.target.value); setPreviewImage(e.target.value) }}
              placeholder="https://..."
              className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none"
              style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
            Pega el link directo a la imagen (Instagram, Drive, Imgur, etc.)
          </p>
        </div>

        {/* Preview imagen */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Vista previa
          </label>
          <div
            className="w-full h-32 rounded-xl border flex items-center justify-center overflow-hidden"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(0.95 0 0)" }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={() => setPreviewImage("")}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Image size={24} style={{ color: "oklch(0.7 0 0)" }} />
                <p className="text-xs" style={{ color: "oklch(0.65 0 0)" }}>Sin imagen</p>
              </div>
            )}
          </div>
        </div>

        {/* Alt imagen */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Descripción de la imagen (alt)
          </label>
          <input
            type="text"
            value={form.imageAlt}
            onChange={(e) => field("imageAlt", e.target.value)}
            placeholder="Descripción breve para accesibilidad"
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Categoría
          </label>
          <select
            value={form.category}
            onChange={(e) => field("category", e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          >
            {categories.filter(c => c.id !== "todos").map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Badge */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Etiqueta (opcional)
          </label>
          <input
            type="text"
            value={form.badge ?? ""}
            onChange={(e) => field("badge", e.target.value)}
            placeholder="Ej: Oferta, Nuevo, Más vendido"
            className="rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ borderColor: "oklch(0.88 0.03 90)", backgroundColor: "oklch(1 0 0)", color: "oklch(0.2 0.02 270)" }}
          />
        </div>

        {/* Badge color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.4 0.03 270)" }}>
            Color de etiqueta
          </label>
          <div className="flex gap-2">
            {BADGE_COLORS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => field("badgeColor", value)}
                title={label}
                className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: value,
                  borderColor: form.badgeColor === value ? "oklch(0.2 0 0)" : "transparent",
                }}
                aria-label={label}
              />
            ))}
          </div>
        </div>

        {/* Destacado */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => field("featured", !form.featured)}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{ backgroundColor: form.featured ? "oklch(0.62 0.18 145)" : "oklch(0.82 0 0)" }}
            aria-pressed={form.featured}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
              style={{
                left: form.featured ? "calc(100% - 22px)" : "2px",
                backgroundColor: "oklch(1 0 0)",
                boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)"
              }}
            />
          </button>
          <label className="text-sm font-medium" style={{ color: "oklch(0.35 0.02 270)" }}>
            Mostrar en productos destacados
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: "oklch(0.88 0.03 90)" }}>
        <button
          onClick={onSave}
          disabled={!isValid}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "oklch(0.6 0.22 5)", color: "oklch(1 0 0)" }}
        >
          <Save size={14} />
          Guardar cambios
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: "oklch(0.88 0.03 90)", color: "oklch(0.5 0.03 270)", backgroundColor: "oklch(1 0 0)" }}
        >
          <X size={14} />
          Cancelar
        </button>
        {!isValid && (
          <p className="text-xs" style={{ color: "oklch(0.55 0.22 5)" }}>
            Nombre y precio son obligatorios
          </p>
        )}
      </div>
    </div>
  )
}
