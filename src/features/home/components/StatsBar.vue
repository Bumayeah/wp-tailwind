<template>
  <AppSection bg="dark-secondary" class="border-y border-white/5" aria-label="SWG in cijfers">
      <dl class="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center text-center py-4 px-6"
        >
          <dt class="text-4xl font-bold text-white tracking-tight">{{ stat.value }}</dt>
          <dd class="text-sm text-white/50 mt-2 leading-snug">{{ stat.label }}</dd>
        </div>
      </dl>
  </AppSection>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{ value: string; label: string }>
}>()
</script>
