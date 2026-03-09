<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  retry?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div class="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center" aria-hidden="true">
      <svg class="w-8 h-8 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    </div>
    <div>
      <p class="text-lg font-semibold dark:text-white">{{ title ?? 'Er ging iets mis' }}</p>
      <p class="text-muted text-sm mt-1">
        {{ description ?? 'Er is een fout opgetreden. Probeer het opnieuw.' }}
      </p>
    </div>
    <BaseButton v-if="retry" variant="secondary" size="sm" @click="retry">
      Probeer opnieuw
    </BaseButton>
  </div>
</template>
