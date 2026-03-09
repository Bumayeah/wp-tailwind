<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  headingId?: string
  align?: 'left' | 'center'
  theme?: 'default' | 'inverted'
}>()
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : ''">
    <p v-if="eyebrow" class="mb-3 text-sm font-semibold tracking-widest text-accent-500 uppercase">
      {{ eyebrow }}
    </p>
    <h2
      :id="headingId"
      :class="['mb-4 text-3xl font-bold md:text-4xl', theme === 'inverted' ? 'text-white' : '']"
    >{{ title }}</h2>
    <p v-if="description" :class="['text-lg', theme === 'inverted' ? 'text-white/60' : 'text-muted']">
      {{ description }}
    </p>
  </div>
</template>
