import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string
}

function isTokenExpired(jwt: string): boolean {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1] ?? ''))
    if (typeof payload.exp !== 'number') return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}

function loadStoredAuth(): { token: string | null; user: AuthUser | null } {
  const storedToken = localStorage.getItem('swg-token')
  const storedUser = localStorage.getItem('swg-user')
  if (!storedToken || isTokenExpired(storedToken)) {
    localStorage.removeItem('swg-token')
    localStorage.removeItem('swg-user')
    return { token: null, user: null }
  }
  const user = storedUser ? (JSON.parse(storedUser) as AuthUser) : null
  return { token: storedToken, user }
}

const stored = loadStoredAuth()

export const useAuthStore = defineStore('auth', () => {
  // TODO: Refactor — store JWT in an HttpOnly, Secure, SameSite=Strict cookie instead of
  // localStorage. Requires the WordPress jwt-auth plugin (or a custom endpoint) to set the
  // cookie server-side on login, and `credentials: 'include'` on every API request.
  // localStorage is acceptable for now but exposes the token to JavaScript (XSS risk).
  const token = ref<string | null>(stored.token)
  const user = ref<AuthUser | null>(stored.user)
  const isLoggedIn = computed(() => !!token.value && !isTokenExpired(token.value))

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('swg-token', newToken)
    localStorage.setItem('swg-user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('swg-token')
    localStorage.removeItem('swg-user')
  }

  return { token, user, isLoggedIn, setAuth, logout }
})
