// Store de clientes minoristas — persiste en localStorage

export interface RetailClient {
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: string
}

const KEY = "cc_retail_clients"
const SESSION_KEY = "cc_retail_session"

export function getRetailClients(): RetailClient[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function registerRetailClient(
  data: Omit<RetailClient, "id" | "createdAt">
): { ok: boolean; error?: string } {
  const clients = getRetailClients()
  if (clients.find((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: "Ya existe una cuenta con ese email." }
  }
  const client: RetailClient = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  clients.push(client)
  localStorage.setItem(KEY, JSON.stringify(clients))
  return { ok: true }
}

export function loginRetailClient(
  email: string,
  password: string
): { ok: boolean; client?: RetailClient; error?: string } {
  const clients = getRetailClients()
  const client = clients.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  )
  if (!client) return { ok: false, error: "Email o contraseña incorrectos." }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: client.id, name: client.name, email: client.email }))
  return { ok: true, client }
}

export function logoutRetailClient(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getRetailSession(): { id: string; name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
