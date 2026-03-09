<script setup lang="ts">
import { userService } from '@/features/user/user.service'

useHead({ title: 'Mijn SWG' })

const { formatDateRange } = useFormatting()

const { data: registrations } = useQuery({
  queryKey: ['mijn', 'registrations'],
  queryFn: userService.getRegistrations,
})

const statusLabel: Record<string, string> = {
  confirmed: 'Bevestigd',
  waitlist: 'Wachtlijst',
  cancelled: 'Geannuleerd',
}
const statusClass: Record<string, string> = {
  confirmed: 'text-success bg-success/10',
  waitlist: 'text-accent-500 bg-accent-500/10',
  cancelled: 'text-muted bg-muted/10',
}
</script>

<template>
  <div class="space-y-6">

    <!-- Upcoming registrations -->
    <section>
      <h2 class="text-lg font-semibold mb-4">Komende reizen</h2>
      <div v-if="!registrations?.length" class="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-6 text-center">
        Je hebt nog geen registrations.
        <RouterLink to="/agenda" class="text-primary-500 hover:underline block mt-2">Bekijk beschikbare reizen →</RouterLink>
      </div>
      <ul v-else role="list" class="space-y-3">
        <li
          v-for="item in registrations"
          :key="item.id"
          class="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-4 flex items-center justify-between gap-4"
        >
          <div>
            <p class="font-semibold text-sm dark:text-white">{{ item.trip_title }}</p>
            <p class="text-xs text-muted mt-0.5">{{ item.location }} · {{ formatDateRange(item.date_from, item.date_to) }}</p>
          </div>
          <span :class="['text-xs font-semibold px-2 py-1 rounded-full shrink-0', statusClass[item.status] ?? 'text-muted bg-muted/10']">
            {{ statusLabel[item.status] ?? item.status }}
          </span>
        </li>
      </ul>
      <RouterLink to="/mijn/registrations" class="text-sm text-primary-500 hover:underline mt-3 inline-block">
        Alle registrations bekijken →
      </RouterLink>
    </section>

    <!-- Quick links -->
    <section class="grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-for="card in [
          { to: '/mijn/profiel', title: 'Mijn profiel', desc: 'Naam, e-mail en telefoonnummer aanpassen' },
          { to: '/mijn/vragen', title: 'Mijn vragen', desc: 'Vragen die je hebt gesteld aan SWG' },
        ]"
        :key="card.to"
        :to="card.to"
        class="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow group"
      >
        <p class="font-semibold text-sm dark:text-white group-hover:text-primary-500 transition-colors">{{ card.title }}</p>
        <p class="text-xs text-muted mt-1">{{ card.desc }}</p>
      </RouterLink>
    </section>

  </div>
</template>
