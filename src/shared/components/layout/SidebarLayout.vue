<script setup lang="ts">
defineProps<{ reverse?: boolean }>()
</script>

<template>
  <div :class="['grid gap-12 lg:items-start', reverse ? 'lg:grid-cols-[1fr_3fr]' : 'lg:grid-cols-[2fr_1fr]']">
    <slot />
    <aside :class="['lg:sticky lg:top-28', reverse ? 'lg:order-first' : '']">
      <slot name="sidebar" />
    </aside>
  </div>
</template>
