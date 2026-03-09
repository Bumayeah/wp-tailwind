<script setup lang="ts">
import type { AgendaItem } from '../agenda.schema'
import { getAvailabilityStatus, AVAILABILITY_LABEL, AVAILABILITY_COLOR } from '../agenda.schema'

const props = defineProps<{
  trip: AgendaItem
  variant?: 'default' | 'featured'
}>()

const queryClient = useQueryClient()
const { formatDateRange, formatCurrency } = useFormatting()

const isPast = computed(() => new Date(props.trip.date_from) < new Date())
const status = computed(() => getAvailabilityStatus(props.trip))

// Seed detail cache from already-loaded list data — no extra API call needed
function onMouseEnter() {
  if (!queryClient.getQueryData(['agenda', props.trip.slug])) {
    queryClient.setQueryData(['agenda', props.trip.slug], props.trip)
  }
}
</script>

<template>
  <article
    :class="[
      'group dark:bg-dark-secondary relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
      isPast || status === 'full' ? 'opacity-80' : '',
    ]"
    @mouseenter="onMouseEnter"
  >
    <!-- Image -->
    <div
      :class="[
        'relative overflow-hidden bg-gray-100 dark:bg-white/5',
        variant === 'featured' ? 'aspect-video' : 'aspect-4/3',
      ]"
    >
      <img
        v-if="trip.image"
        :src="trip.image"
        :alt="trip.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="text-muted flex h-full w-full items-center justify-center">
        <svg
          class="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18"
          />
        </svg>
      </div>

      <!-- Badge overlay -->
      <div class="absolute top-3 right-3">
        <span
          v-if="isPast"
          role="status"
          class="bg-muted/10 text-muted rounded-full px-2.5 py-1 text-xs font-semibold"
        >
          Afgelopen
        </span>
        <span
          v-else
          role="status"
          :class="['rounded-full px-2.5 py-1 text-xs font-semibold', AVAILABILITY_COLOR[status]]"
        >
          {{ AVAILABILITY_LABEL[status] }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div :class="['flex flex-1 flex-col gap-2', variant === 'featured' ? 'p-7' : 'p-5']">
      <p class="text-muted text-sm">
        {{ formatDateRange(trip.date_from, trip.date_to) }} · {{ trip.location }}
      </p>
      <h3 :class="['leading-snug font-semibold', variant === 'featured' ? 'text-xl' : 'text-lg']">
        {{ trip.title }}
      </h3>

      <p
        v-if="variant === 'featured' && trip.description"
        class="text-muted line-clamp-3 text-sm leading-relaxed"
      >
        {{ trip.description }}
      </p>

      <template v-else>
        <div class="text-muted flex items-center gap-1.5 text-sm">
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ trip.location }}</span>
        </div>
        <div class="text-muted flex items-center gap-1.5 text-sm">
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ formatDateRange(trip.date_from, trip.date_to) }}</span>
        </div>
      </template>

      <div
        :class="[
          'mt-auto flex items-center justify-between',
          variant === 'featured' ? 'pt-5' : 'pt-3',
        ]"
      >
        <span
          v-if="!isPast"
          :class="['text-primary-500 font-bold', variant === 'featured' ? 'text-2xl' : 'text-lg']"
          >{{ formatCurrency(trip.price) }}</span
        >
        <span v-else class="text-muted text-sm">{{
          formatDateRange(trip.date_from, trip.date_to)
        }}</span>
        <BaseArrowLink :to="`/agenda/${trip.slug}`">
          {{ isPast ? 'Terugblik' : 'Meer info' }}
        </BaseArrowLink>
      </div>
    </div>
  </article>
</template>
