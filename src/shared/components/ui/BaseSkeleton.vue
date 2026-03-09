<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    role="status"
    aria-label="Laden..."
    :class="['animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10', $props.class]"
  />
</template>
