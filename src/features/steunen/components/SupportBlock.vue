<script setup lang="ts">
defineProps<{
  title?: string
  content?: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
}>()
</script>

<template>
  <AppSection>
      <div
        :class="[
          'grid gap-10 lg:grid-cols-2 items-center',
          imagePosition === 'right' ? '' : 'lg:[&>*:first-child]:order-2',
        ]"
      >
        <!-- Image -->
        <div class="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-white/5">
          <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="imageAlt ?? ''"
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-primary-900 to-dark opacity-60" aria-hidden="true" />
        </div>

        <!-- Text -->
        <div class="space-y-5">
          <h2 v-if="title" class="text-3xl md:text-4xl font-bold">{{ title }}</h2>
          <SanitizedHtml v-if="content" :html="content" class="prose prose-sm max-w-none text-muted" />
          <div v-if="$slots.cta">
            <slot name="cta" />
          </div>
        </div>
      </div>
  </AppSection>
</template>
