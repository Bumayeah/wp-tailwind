<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="flex items-center gap-1 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600 after:absolute after:inset-0"
  >
    <slot />
    <svg
      class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clip-rule="evenodd"
      />
    </svg>
  </RouterLink>
</template>
