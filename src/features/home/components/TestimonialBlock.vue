<script setup lang="ts">
import { apiGet } from '@/shared/services/api'
import photoUrl from '@/assets/swg-23.jpg'

interface Testimonial {
  id: number
  name: string
  quote: string
  trip: string
}

defineProps<{
  eyebrow: string
  title: string
}>()

const { data } = useQuery({
  queryKey: ['testimonials'],
  queryFn: () => apiGet<Testimonial[]>('/swg/v1/testimonials'),
  staleTime: 10 * 60 * 1000,
})

const testimonials = computed(() => data.value ?? [])

const { trackRef, isDragging, onDragStart, onDragMove, onDragEnd } = useDragScroll()
</script>

<template>
  <section aria-labelledby="testimonials-title">
    <!-- Photo header -->
    <div class="relative h-72 overflow-hidden md:h-96">
      <img
        :src="photoUrl"
        alt="SWG deelnemers op de piste"
        class="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        width="1600"
        height="900"
      />
      <div
        class="from-dark/80 via-dark/30 to-dark/10 absolute inset-0 bg-linear-to-t"
        aria-hidden="true"
      />
      <div class="absolute inset-0 container mx-auto flex flex-col justify-end px-4 pb-10">
        <p class="text-accent-500 mb-2 text-sm font-semibold tracking-widest uppercase">
          {{ eyebrow }}
        </p>
        <h2 id="testimonials-title" class="text-3xl font-bold text-white md:text-4xl">
          {{ title }}
        </h2>
      </div>
    </div>

    <!-- Testimonial cards -->
    <div class="dark:bg-dark-secondary overflow-hidden bg-gray-50 py-16">
      <div
        ref="trackRef"
        class="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Deelnemerservaringen"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
      >
        <!-- Leading spacer: aligns first card with the container's left edge -->
        <div class="shrink-0" :style="{ width: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))' }" aria-hidden="true" />

        <blockquote
          v-for="item in testimonials"
          :key="item.id"
          role="listitem"
          class="dark:bg-dark flex w-[85vw] flex-none snap-start flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm sm:w-105"
        >
          <svg
            class="text-primary-500/30 h-8 w-8"
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M10 8C6.134 8 3 11.134 3 15v9h9v-9H6c0-2.206 1.794-4 4-4V8zm19 0c-3.866 0-7 3.134-7 7v9h9v-9h-6c0-2.206 1.794-4 4-4V8z"
            />
          </svg>

          <p class="flex-1 text-lg leading-relaxed dark:text-white/90">"{{ item.quote }}"</p>

          <footer class="text-sm">
            <span class="font-semibold dark:text-white">{{ item.name }}</span>
            <span class="text-muted"> — {{ item.trip }}</span>
          </footer>
        </blockquote>

        <!-- Trailing spacer -->
        <div class="shrink-0" :style="{ width: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))' }" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
