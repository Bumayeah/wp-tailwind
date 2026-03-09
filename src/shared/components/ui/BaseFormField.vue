<script setup lang="ts">
defineProps<{
  id: string
  label: string
  error?: string
  required?: boolean
  optional?: boolean
}>()
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium mb-1 dark:text-white">
      {{ label }}
      <span v-if="required" class="text-red-500" aria-hidden="true"> *</span>
      <span v-if="optional" class="text-muted text-xs"> (optioneel)</span>
    </label>
    <slot />
    <p v-if="error" role="alert" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
