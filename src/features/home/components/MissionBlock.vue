<script setup lang="ts">
import photoUrl from '@/assets/swg-07.jpg'

defineProps<{
  eyebrow: string
  title: string
  intro: string
  body: string
  highlights: string[]
  foundedText: string
  foundedDetail: string
}>()
</script>

<template>
  <AppSection>
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <!-- Image -->
      <div
        class="relative order-last aspect-4/3 overflow-hidden rounded-2xl shadow-xl lg:order-first"
      >
        <img
          :src="photoUrl"
          alt="Skiinstructeur met deelnemer op de piste"
          class="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
        />
        <!-- Floating badge -->
        <div
          class="dark:bg-dark absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg"
        >
          <div
            class="bg-primary-500/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          >
            <svg
              class="text-primary-500 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold dark:text-white">{{ foundedText }}</p>
            <p class="text-muted text-xs">{{ foundedDetail }}</p>
          </div>
        </div>
      </div>

      <!-- Text -->
      <div>
        <SectionHeader
          :eyebrow="eyebrow"
          heading-id="mission-title"
          :title="title"
          class="mb-6"
        />
        <div class="text-muted space-y-4 text-base leading-relaxed">
          <p>{{ intro }}</p>
          <p>{{ body }}</p>
        </div>

        <ul class="mt-8 space-y-3" role="list">
          <li
            v-for="point in highlights"
            :key="point"
            class="flex items-start gap-3 text-sm dark:text-white/90"
          >
            <svg
              class="text-primary-500 mt-0.5 h-5 w-5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ point }}</span>
          </li>
        </ul>

        <div class="mt-10 flex flex-wrap gap-3">
          <BaseButton to="/over-ons" size="lg"> Over de organisatie → </BaseButton>
          <BaseButton to="/contact" variant="secondary" size="lg"> Neem contact op </BaseButton>
        </div>
      </div>
    </div>
  </AppSection>
</template>
