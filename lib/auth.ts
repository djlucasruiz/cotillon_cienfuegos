// Credenciales del administrador
// Para cambiar la contraseña, modificá ADMIN_PASSWORD
const ADMIN_USER = "CIENFUEGOSO325"
const ADMIN_PASSWORD = "CIENFUEGOSO325"
const AUTH_KEY = "cc_admin_session"

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const session = {
      user: username,
      expires: Date.now() + 1000 * 60 * 60 * 8, // 8 horas
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    if (Date.now() > session.expires) {
      localStorage.removeItem(AUTH_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}
