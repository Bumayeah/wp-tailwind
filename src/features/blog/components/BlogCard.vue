<script setup lang="ts">
import type { Post } from '../blog.schema'

const props = defineProps<{
  post: Post
}>()

const queryClient = useQueryClient()
const { formatDate } = useFormatting()

// Seed detail cache from list data
function onMouseEnter() {
  if (!queryClient.getQueryData(['posts', props.post.slug])) {
    queryClient.setQueryData(['posts', props.post.slug], props.post)
  }
}
</script>

<template>
  <article
    class="relative group rounded-2xl overflow-hidden bg-white dark:bg-dark-secondary shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    @mouseenter="onMouseEnter"
  >
    <!-- Image — decoratief (hele kaart is klikbaar via RouterLink overlay) -->
    <div class="relative aspect-[16/9] bg-gray-100 dark:bg-white/5 overflow-hidden">
      <BaseImage
        v-if="post.featured_media_url"
        :src="post.featured_media_url"
        alt=""
        :width="800"
        :height="450"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-muted">
        <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-2 p-5 flex-1">
      <p class="text-xs text-muted">{{ formatDate(post.date) }}</p>
      <h3 class="text-lg font-semibold leading-snug">{{ post.title.rendered }}</h3>
      <SanitizedHtml tag="p" :html="post.excerpt.rendered" class="text-sm text-muted leading-relaxed line-clamp-3" />

      <div class="mt-auto pt-3">
        <BaseArrowLink :to="`/blog-posts/${post.slug}`">Lees verder</BaseArrowLink>
      </div>
    </div>
  </article>
</template>
