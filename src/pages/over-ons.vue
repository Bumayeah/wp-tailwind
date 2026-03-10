<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'
import TextImageBlock from '@/shared/components/TextImageBlock.vue'
import CtaBlock from '@/shared/components/CtaBlock.vue'

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Over ons'}`,
  meta: [{ name: 'description', content: page.value?.acf?.hero_description ?? '' }],
})))

const { data: page } = useQuery({
  queryKey: ['pages', 'over-ons'],
  queryFn: () => pageService.getBySlug('over-ons'),
  staleTime: 10 * 60 * 1000,
})

const acf = computed(() => page.value?.acf as Record<string, any> | undefined)
const galleryPhotos = computed<{ src: string; alt: string }[]>(() => acf.value?.gallery ?? [])
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Wie zijn wij'"
    :title="page?.title?.rendered ?? 'Over ons'"
    :description="page?.acf?.hero_description"
  />

  <!-- Intro -->
  <div v-if="page?.content?.rendered" class="container mx-auto px-4 py-12 max-w-3xl">
    <SanitizedHtml :html="page.content.rendered" class="prose max-w-none text-muted text-lg leading-relaxed" />
  </div>

  <!-- Text + image block 1 -->
  <TextImageBlock
    v-if="acf?.text_block_1?.content"
    :content="acf.text_block_1.content"
    :image-src="acf.text_block_1.image"
    :image-alt="acf.text_block_1.image_alt ?? ''"
    image-position="right"
  />

  <!-- Photo gallery -->
  <AppSection v-if="acf?.show_gallery" bg="gray" aria-label="Sfeerimpressie">
    <h2 class="text-2xl font-bold text-center mb-8 dark:text-white">Sfeerimpressie</h2>
    <PhotoGrid :photos="galleryPhotos" />
  </AppSection>

  <!-- Text + image block 2 -->
  <TextImageBlock
    v-if="acf?.text_block_2?.content"
    :content="acf.text_block_2.content"
    :image-src="acf.text_block_2.image"
    :image-alt="acf.text_block_2.image_alt ?? ''"
    image-position="left"
  />

  <!-- CTA -->
  <CtaBlock
    v-if="acf?.show_cta"
    :heading="acf?.cta_heading"
    :body="acf?.cta_body"
  />
</template>
