<template>
  <AppSection bg="white" aria-labelledby="why-swg-title">

      <!-- Header -->
      <div class="max-w-2xl mb-16">
        <SectionHeader
          :eyebrow="eyebrow"
          heading-id="why-swg-title"
          :title="title"
          :description="description"
        />
      </div>

      <!-- Feature grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group rounded-2xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-dark-secondary p-7 hover:border-primary-500/30 hover:shadow-md transition-all duration-200"
        >
          <!-- Icon -->
          <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5 group-hover:bg-primary-500/15 transition-colors">
            <component :is="featureIcons[index]" class="w-6 h-6 text-primary-500" aria-hidden="true" />
          </div>
          <h3 class="text-base font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-sm text-muted leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Bottom link -->
      <div class="mt-12 flex justify-center">
        <BaseButton to="/over-ons" variant="ghost">
          Meer over SWG Nederland →
        </BaseButton>
      </div>

  </AppSection>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

defineProps<{
  eyebrow: string
  title: string
  description: string
  features: Array<{ title: string; description: string }>
}>()

function svgIcon(paths: string) {
  return defineComponent({
    render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      [h('path', { d: paths })],
    ),
  })
}

// Icons are keyed by feature index — fixed order matching the four why_swg_features
const featureIcons = [
  svgIcon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'),
  svgIcon('M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'),
  svgIcon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'),
  svgIcon('M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'),
]
</script>
