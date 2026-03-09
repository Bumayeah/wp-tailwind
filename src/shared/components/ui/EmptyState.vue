<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  cta?: { label: string; to: string }
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center" aria-hidden="true">
      <svg class="w-8 h-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    </div>
    <div>
      <p class="text-lg font-semibold dark:text-white">{{ title }}</p>
      <p v-if="description" class="text-muted text-sm mt-1">{{ description }}</p>
    </div>
    <BaseButton v-if="cta" :to="cta.to" variant="secondary" size="sm">
      {{ cta.label }}
    </BaseButton>
  </div>
</template>
