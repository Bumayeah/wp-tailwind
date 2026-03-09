<script setup lang="ts">
import { apiGet } from '@/shared/services/api'

interface AgendaItem {
  id: number
  slug: string
  title: { rendered: string }
  acf: {
    destination: string
    date_from: string
    date_to: string
  }
}

const auth = useAuthStore()
const ui = useUiStore()

const { data: trips } = useQuery({
  queryKey: ['agenda'],
  queryFn: () => apiGet<AgendaItem[]>('/swg/v1/agenda'),
  staleTime: 5 * 60 * 1000,
})

const nextTrip = computed(
  () =>
    [...(trips.value ?? [])]
      .filter((t) => new Date(t.acf.date_from) >= new Date())
      .sort((a, b) => new Date(a.acf.date_from).getTime() - new Date(b.acf.date_from).getTime())[0],
)

const fmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
function formatDate(iso: string) {
  return fmt.format(new Date(iso))
}
</script>

<template>
  <div class="bg-dark hidden py-1.5 text-sm text-white/70 md:block">
    <div class="container mx-auto flex items-center justify-between px-4">
      <!-- Next trip highlight -->
      <RouterLink
        v-if="nextTrip"
        to="/agenda"
        class="hover:text-accent-500 flex items-center gap-2 transition-colors"
      >
        <span aria-hidden="true">🎿</span>
        <span>
          Volgende vakantie:
          <strong class="text-white">{{ nextTrip.title.rendered }}</strong>
          — {{ formatDate(nextTrip.acf.date_from) }}
        </span>
      </RouterLink>
      <span v-else />

      <!-- Secondary nav + auth -->
      <nav aria-label="Secondary navigation" class="flex items-center gap-4">
        <RouterLink to="/over-ons" class="transition-colors hover:text-white"
          >Over de stichting</RouterLink
        >
        <RouterLink to="/steunen" class="transition-colors hover:text-white">Steun ons</RouterLink>
        <span aria-hidden="true" class="text-white/30">|</span>
        <button
          v-if="!auth.isLoggedIn"
          class="transition-colors hover:text-white"
          @click="ui.openAuthModal({ view: 'login' })"
        >
          Inloggen
        </button>
        <RouterLink v-else to="/mijn" class="transition-colors hover:text-white">
          Mijn account
        </RouterLink>
      </nav>
    </div>
  </div>
</template>
