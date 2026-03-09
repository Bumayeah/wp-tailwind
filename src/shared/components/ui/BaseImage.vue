<script setup lang="ts">
defineProps<{
  src: string
  alt: string
  width: number
  height: number
  eager?: boolean
  class?: string
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    :class="$props.class"
  />
</template>
