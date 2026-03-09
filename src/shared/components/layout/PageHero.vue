<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  imageSrc?: string
  backTo?: string
  backLabel?: string
}>()
</script>

<template>
  <div class="bg-dark relative overflow-hidden py-16 text-white md:py-24">
    <div
      v-if="imageSrc"
      class="absolute inset-0 bg-cover bg-center opacity-30"
      :style="{ backgroundImage: `url(${imageSrc})` }"
      aria-hidden="true"
    />
    <div
      v-if="imageSrc"
      class="from-dark absolute inset-0 bg-linear-to-t to-transparent"
      aria-hidden="true"
    />
    <div class="relative container mx-auto px-4">
      <RouterLink
        v-if="backTo"
        :to="backTo"
        class="text-accent-500 mb-3 inline-flex items-center gap-1 text-sm font-semibold tracking-widest uppercase transition-colors hover:text-white"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clip-rule="evenodd"
          />
        </svg>
        {{ backLabel }}
      </RouterLink>
      <p
        v-if="eyebrow"
        class="text-accent-500 mb-3 text-sm font-semibold tracking-widest uppercase"
      >
        {{ eyebrow }}
      </p>
      <h1 class="mb-4 text-4xl font-bold md:text-5xl">{{ title }}</h1>
      <p v-if="description" class="max-w-xl text-lg text-white/70">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
