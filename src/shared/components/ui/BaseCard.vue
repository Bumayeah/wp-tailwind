<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'elevated' | 'accent'
  padding?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl',
      (!variant || variant === 'default')
        ? 'border border-gray-100 bg-gray-50 dark:border-white/8 dark:bg-dark-secondary'
        : variant === 'elevated'
          ? 'bg-white shadow-sm dark:bg-dark-secondary'
          : 'border border-primary-500/15 bg-primary-500/5',
      (!padding || padding === 'md') ? 'p-6' : padding === 'lg' ? 'p-8' : 'p-4',
    ]"
  >
    <slot />
  </div>
</template>
