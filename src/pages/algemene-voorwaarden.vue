<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Algemene voorwaarden'}`,
})))

const { data: page, isPending } = useQuery({
  queryKey: ['pages', 'av'],
  queryFn: () => pageService.getBySlug('av'),
  staleTime: 10 * 60 * 1000,
})
</script>

<template>
  <PageHero :eyebrow="page?.acf?.hero_eyebrow ?? 'Juridisch'" :title="page?.title?.rendered ?? 'Algemene voorwaarden'" />

  <!-- Content -->
  <div class="container mx-auto px-4 py-12 max-w-3xl">
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton class="h-6 w-full" />
      <BaseSkeleton class="h-6 w-5/6" />
      <BaseSkeleton class="h-6 w-full" />
      <BaseSkeleton class="h-6 w-4/5" />
    </div>
    <SanitizedHtml
      v-else-if="page?.content?.rendered"
      :html="page.content.rendered"
      class="prose max-w-none text-muted leading-relaxed"
    />
  </div>
</template>
