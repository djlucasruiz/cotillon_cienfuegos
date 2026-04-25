export interface WholesaleClient {
  id: string
  businessName: string
  ownerName: string
  username: string
  password: string
  phone: string
  email: string
  city: string
  businessType: string
  discount: number          // % de descuento sobre precio minorista
  active: boolean
  createdAt: string
  notes: string
}

const STORAGE_KEY = "cc_wholesale_clients"
const SESSION_KEY = "cc_wholesale_session"

// ─── Clientes demo precargados ─────────────────────────────────────────────
const DEFAULT_CLIENTS: WholesaleClient[] = [
  {
    id: "ws-001",
    businessName: "Kiosco El Sol",
    ownerName: "María López",
    username: "kioscoelsol",
    password: "kiosco2024",
    phone: "345 412-3456",
    email: "kioscoelsol@gmail.com",
    city: "Concordia",
    businessType: "Kiosco",
    discount: 20,
    active: true,
    createdAt: new Date().toISOString(),
    notes: "Cliente frecuente",
  },
]

// ─── CRUD clientes ─────────────────────────────────────────────────────────
export function getClients(): WholesaleClient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS))
      return DEFAULT_CLIENTS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_CLIENTS
  }
}

export function saveClients(clients: WholesaleClient[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function createClient(data: Omit<WholesaleClient, "id" | "createdAt">): WholesaleClient {
  const clients = getClients()
  const newClient: WholesaleClient = {
    ...data,
    id: "ws-" + Math.random().toString(36).slice(2, 9),
    createdAt: new Date().toISOString(),
  }
  saveClients([...clients, newClient])
  return newClient
}

export function updateClient(id: string, data: Partial<WholesaleClient>): void {
  const clients = getClients()
  saveClients(clients.map((c) => (c.id === id ? { ...c, ...data } : c)))
}

export function deleteClient(id: string): void {
  saveClients(getClients().filter((c) => c.id !== id))
}

// ─── Sesión mayorista ──────────────────────────────────────────────────────
export function wholesaleLogin(username: string, password: string): WholesaleClient | null {
  const clients = getClients()
  const client = clients.find(
    (c) => c.username === username && c.password === password && c.active
  )
  if (!client) return null
  const session = { clientId: client.id, expires: Date.now() + 1000 * 60 * 60 * 8 }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return client
}

export function wholesaleLogout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getWholesaleSession(): WholesaleClient | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (Date.now() > session.expires) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    const clients = getClients()
    return clients.find((c) => c.id === session.clientId && c.active) ?? null
  } catch {
    return null
  }
}
