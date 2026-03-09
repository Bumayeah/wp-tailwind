<script setup lang="ts">
import { agendaService } from '@/features/agenda/agenda.service'
import AgendaCard from '@/features/agenda/components/AgendaCard.vue'

useHead({ title: 'Reizen' })

const PER_PAGE = 6

const {
  data: trips,
  isPending,
  isError,
  refetch,
} = useQuery({
  queryKey: ['agenda'],
  queryFn: agendaService.getAll,
  staleTime: 5 * 60 * 1000,
})

const upcoming = computed(() =>
  (trips.value ?? []).filter((t) => new Date(t.date_from) >= new Date()),
)

const allPast = computed(() =>
  (trips.value ?? [])
    .filter((t) => new Date(t.date_from) < new Date())
    .sort((a, b) => new Date(b.date_from).getTime() - new Date(a.date_from).getTime()),
)

const upcomingPage = ref(1)
const pastPage = ref(1)

const upcomingTotalPages = computed(() => Math.ceil(upcoming.value.length / PER_PAGE))
const pastTotalPages = computed(() => Math.ceil(allPast.value.length / PER_PAGE))

const upcomingPaged = computed(() => {
  const start = (upcomingPage.value - 1) * PER_PAGE
  return upcoming.value.slice(start, start + PER_PAGE)
})

const pastPaged = computed(() => {
  const start = (pastPage.value - 1) * PER_PAGE
  return allPast.value.slice(start, start + PER_PAGE)
})

watch(upcomingPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
watch(pastPage, () => {
  document.getElementById('past-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
</script>

<template>
  <PageHero
    eyebrow="Ski met ons mee"
    title="Aankomende reizen"
    description="SWG organiseert jaarlijks groepsreizen naar Italië en Oostenrijk. Met aangepast materiaal en deskundige begeleiding voor ieder niveau."
  />

  <div class="container mx-auto px-4 py-16">
    <!-- Loading -->
    <div v-if="isPending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-96" />
    </div>

    <!-- Error -->
    <ErrorState
      v-else-if="isError"
      description="Reizen konden niet worden geladen."
      :retry="refetch"
    />

    <template v-else>
      <!-- Upcoming trips -->
      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" class="sr-only">Aankomende reizen</h2>

        <EmptyState
          v-if="!upcoming.length"
          title="Geen reizen gepland"
          description="Er zijn momenteel geen aankomende reizen. Houd de website in de gaten voor nieuwe reizen."
        />

        <template v-else>
          <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="trip in upcomingPaged" :key="trip.id">
              <AgendaCard :trip="trip" />
            </li>
          </ul>
          <BasePagination
            :current-page="upcomingPage"
            :total-pages="upcomingTotalPages"
            @update:current-page="upcomingPage = $event"
          />
        </template>
      </section>

      <!-- Past trips -->
      <section v-if="allPast.length" class="mt-16" aria-labelledby="past-title">
        <h2 id="past-title" class="text-muted mb-6 text-xl font-semibold">Eerdere reizen</h2>
        <ul role="list" class="grid gap-6 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="trip in pastPaged" :key="trip.id">
            <AgendaCard :trip="trip" />
          </li>
        </ul>
        <BasePagination
          :current-page="pastPage"
          :total-pages="pastTotalPages"
          @update:current-page="pastPage = $event"
        />
      </section>
    </template>
  </div>
</template>
