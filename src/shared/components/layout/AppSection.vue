<script setup lang="ts">
defineProps<{
  tag?: string
  bg?: 'white' | 'gray' | 'dark' | 'dark-secondary'
}>()
</script>

<template>
  <component
    :is="tag ?? 'section'"
    :class="[
      'py-16',
      bg === 'white'
        ? 'bg-white dark:bg-dark'
        : bg === 'gray'
          ? 'bg-gray-50 dark:bg-dark-secondary'
          : bg === 'dark'
            ? 'bg-dark'
            : bg === 'dark-secondary'
              ? 'bg-dark-secondary'
              : '',
    ]"
  >
    <div class="container mx-auto px-4">
      <slot />
    </div>
  </component>
</template>
