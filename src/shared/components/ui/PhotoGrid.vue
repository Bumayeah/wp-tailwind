<script setup lang="ts">
defineProps<{
  photos: { src: string; alt: string }[]
  variant?: 'default' | 'sidebar'
}>()
</script>

<template>
  <!-- Default: descriptive 2/3-col grid -->
  <ul v-if="!variant || variant === 'default'" role="list" class="grid grid-cols-2 md:grid-cols-3 gap-3">
    <li v-for="photo in photos" :key="photo.src">
      <div class="aspect-4/3 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
        <img
          :src="photo.src"
          :alt="photo.alt"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>
    </li>
  </ul>

  <!-- Sidebar: decorative feature grid, first photo full-width -->
  <div v-else class="grid grid-cols-2 gap-2" aria-hidden="true">
    <div
      v-for="(photo, i) in photos"
      :key="photo.src"
      :class="['overflow-hidden rounded-xl', i === 0 ? 'col-span-2 aspect-video' : 'aspect-square']"
    >
      <img
        :src="photo.src"
        alt=""
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
</template>
