<script setup lang="ts">
import { blogService } from '@/features/blog/blog.service'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { formatDateFull } = useFormatting()

const { data: post, isPending, isError } = useQuery({
  queryKey: ['posts', slug],
  queryFn: () => blogService.getPostBySlug(slug.value),
  staleTime: 5 * 60 * 1000,
})

useHead(computed(() => ({
  title: post.value ? `${post.value.title.rendered}` : 'Nieuws',
})))
</script>

<template>
  <!-- Loading -->
  <div v-if="isPending" class="container mx-auto px-4 py-16 space-y-6">
    <BaseSkeleton class="h-10 w-2/3" />
    <BaseSkeleton class="h-5 w-1/4" />
    <BaseSkeleton class="h-72 w-full" />
    <BaseSkeleton class="h-48 w-full" />
  </div>

  <!-- Error -->
  <div v-else-if="isError" class="container mx-auto px-4 py-16">
    <ErrorState
      title="Bericht niet gevonden"
      description="Dit nieuwsbericht bestaat niet of is niet meer beschikbaar."
      :retry="undefined"
    >
      <template #default>
        <BaseButton to="/nieuws" variant="secondary" class="mt-4">← Terug naar nieuws</BaseButton>
      </template>
    </ErrorState>
  </div>

  <article v-else-if="post">
    <PageHero
      :title="post.title.rendered"
      :image-src="post.featured_media_url"
      back-to="/nieuws"
      back-label="Alle berichten"
    >
      <p class="text-sm text-white/60 mt-1">{{ formatDateFull(post.date) }}</p>
    </PageHero>

    <div class="container mx-auto px-4 py-12 max-w-3xl">
      <SanitizedHtml :html="post.content.rendered" class="prose prose-sm md:prose max-w-none text-muted" />
    </div>
  </article>
</template>
