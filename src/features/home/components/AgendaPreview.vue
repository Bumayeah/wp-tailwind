<script setup lang="ts">
import { agendaService } from '@/features/agenda/agenda.service'
import AgendaCard from '@/features/agenda/components/AgendaCard.vue'

defineProps<{
  eyebrow: string
  title: string
}>()

const { data: trips, isPending, isError, refetch } = useQuery({
  queryKey: ['agenda'],
  queryFn: agendaService.getAll,
  staleTime: 5 * 60 * 1000,
})

// Only show upcoming trips
const upcomingTrips = computed(() =>
  (trips.value ?? []).filter(t => new Date(t.date_from) >= new Date()),
)
</script>

<template>
  <AppSection bg="white" aria-labelledby="agenda-preview-title">

      <div class="flex items-end justify-between mb-10">
        <SectionHeader
          :eyebrow="eyebrow"
          heading-id="agenda-preview-title"
          :title="title"
        />
        <RouterLink
          to="/agenda"
          class="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
        >
          Alle reizen
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
          </svg>
        </RouterLink>
      </div>

      <!-- Skeletons -->
      <div v-if="isPending" class="grid gap-8 sm:grid-cols-2">
        <BaseSkeleton v-for="n in 2" :key="n" class="h-96" />
      </div>

      <!-- Error -->
      <ErrorState v-else-if="isError" description="Reizen konden niet worden geladen." :retry="refetch" />

      <!-- Empty -->
      <EmptyState
        v-else-if="!upcomingTrips.length"
        title="Geen reizen gepland"
        description="Er zijn momenteel geen aankomende reizen. Houd onze website in de gaten voor nieuwe reizen."
      />

      <!-- Cards -->
      <div v-else class="grid gap-8 sm:grid-cols-2">
        <AgendaCard
          v-for="trip in upcomingTrips.slice(0, 2)"
          :key="trip.id"
          :trip="trip"
          variant="featured"
        />
      </div>

      <!-- Mobile: show all link -->
      <div class="mt-8 flex justify-center sm:hidden">
        <BaseButton to="/agenda" variant="secondary">Alle reizen bekijken</BaseButton>
      </div>

  </AppSection>
</template>
