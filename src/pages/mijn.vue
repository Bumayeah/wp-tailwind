<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}

const navItems = [
  { to: '/mijn', label: 'Overzicht' },
  { to: '/mijn/inschrijvingen', label: 'Mijn inschrijvingen' },
  { to: '/mijn/vragen', label: 'Mijn vragen' },
  { to: '/mijn/profiel', label: 'Mijn profiel' },
]
</script>

<template>
  <PageHero eyebrow="Mijn SWG" :title="auth.user?.name ?? 'Mijn account'" />

  <AppSection tag="div">
    <SidebarLayout reverse>

      <!-- Main content -->
      <div class="min-w-0">
        <RouterView />
      </div>

      <template #sidebar>
        <nav aria-label="Mijn SWG navigatie" class="space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="route.path === item.to
              ? 'bg-primary-500 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-white/5 text-muted'"
          >
            {{ item.label }}
          </RouterLink>

          <div class="pt-4 border-t border-gray-100 dark:border-white/10 mt-2">
            <button
              class="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full text-left transition-colors"
              @click="logout"
            >
              Uitloggen
            </button>
          </div>
        </nav>
      </template>

    </SidebarLayout>
  </AppSection>
</template>
