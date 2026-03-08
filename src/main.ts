import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

import App from './App.vue'
import './styles/tailwind.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// HMR support for file-based routes in dev
if (import.meta.hot) {
  handleHotUpdate(router)
}

// Route guard — protect /mijn/* routes
router.beforeEach((to) => {
  const token = localStorage.getItem('swg-token')
  const protectedPrefix = '/mijn'
  if (to.path.startsWith(protectedPrefix) && !token) {
    return { path: '/account/login', query: { redirect: to.fullPath } }
  }
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

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
