import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { createHead } from '@unhead/vue/client'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { setUnauthorizedHandler } from '@/shared/services/api'

import App from './App.vue'
import './styles/tailwind.css'

// Create Pinia first so stores are available in the route guard
const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    //TODO: remove behavior: 'instant' for smooth scroll but currently we use a hash # for github pages
    return { top: 0, behavior: 'instant' }
  },
})

// HMR support for file-based routes in dev
if (import.meta.hot) {
  handleHotUpdate(router)
}

// Route guard — protect /mijn/* routes
router.beforeEach((to) => {
  const auth = useAuthStore(pinia)
  if (to.path.startsWith('/mijn') && !auth.isLoggedIn) {
    useUiStore(pinia).openAuthModal({ view: 'login', redirectTo: to.fullPath })
    return false
  }
})

// Global 401 handler: expired token → logout and open login modal
setUnauthorizedHandler(() => {
  const auth = useAuthStore(pinia)
  auth.logout()
  useUiStore(pinia).openAuthModal({ view: 'login', redirectTo: router.currentRoute.value.fullPath })
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(createHead())

app.mount('#app')
