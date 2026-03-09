import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { usePreferredColorScheme } from '@vueuse/core'

type Theme = 'system' | 'light' | 'dark'

interface CookieConsent {
  youtube: boolean
  analytics: boolean
}

export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>((localStorage.getItem('swg-theme') as Theme) ?? 'system')
  const preferredScheme = usePreferredColorScheme()

  const resolvedTheme = computed<'light' | 'dark'>(() => {
    if (theme.value === 'system') {
      return preferredScheme.value === 'dark' ? 'dark' : 'light'
    }
    return theme.value
  })

  watch(resolvedTheme, (val) => {
    document.documentElement.setAttribute('data-theme', val)
  }, { immediate: true })

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem('swg-theme', t)
  }

  const savedConsent = localStorage.getItem('swg-consent')
  const cookieConsent = ref<CookieConsent>(
    savedConsent ? (JSON.parse(savedConsent) as CookieConsent) : { youtube: false, analytics: false },
  )

  function setConsent(consent: CookieConsent) {
    cookieConsent.value = consent
    localStorage.setItem('swg-consent', JSON.stringify(consent))
  }

  // Auth modal
  interface AuthModalState {
    open: boolean
    view: 'login' | 'register'
    redirectTo: string | null
  }
  const authModal = ref<AuthModalState>({ open: false, view: 'login', redirectTo: null })

  function openAuthModal(opts?: { view?: 'login' | 'register'; redirectTo?: string }) {
    authModal.value = { open: true, view: opts?.view ?? 'login', redirectTo: opts?.redirectTo ?? null }
  }

  function closeAuthModal() {
    authModal.value.open = false
  }

  return { theme, resolvedTheme, setTheme, cookieConsent, setConsent, authModal, openAuthModal, closeAuthModal }
})
