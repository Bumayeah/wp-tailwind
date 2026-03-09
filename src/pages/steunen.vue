<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'
import SupportBlock from '@/features/steunen/components/SupportBlock.vue'
import IDealFlow from '@/features/steunen/components/IDealFlow.vue'
import SponsorGrid from '@/features/home/components/SponsorGrid.vue'

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Steunen'}`,
  meta: [{ name: 'description', content: page.value?.acf?.hero_description ?? '' }],
})))

const { data: page } = useQuery({
  queryKey: ['pages', 'steunen'],
  queryFn: () => pageService.getBySlug('steunen'),
  staleTime: 10 * 60 * 1000,
})

// acf is Record<string, unknown> — cast for nested access
const acf = computed(() => page.value?.acf as Record<string, any> | undefined)
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Steunen'"
    :title="page?.title?.rendered ?? 'Steunen'"
    :description="page?.acf?.hero_description"
  />

  <!-- Intro -->
  <div v-if="page?.content?.rendered" class="container mx-auto max-w-3xl px-4 py-10">
    <SanitizedHtml :html="page.content.rendered" class="prose text-muted max-w-none" />
  </div>

  <!-- Block 1: Become a volunteer -->
  <SupportBlock
    id="vrijwilliger"
    :title="acf?.volunteer?.title ?? 'Vrijwilliger worden'"
    :content="acf?.volunteer?.content"
    :image-src="acf?.volunteer?.image"
    :image-alt="acf?.volunteer?.image_alt ?? 'Vrijwilligers op de piste'"
    image-position="left"
  >
    <template #cta>
      <BaseButton to="/contact">Meld je aan als vrijwilliger →</BaseButton>
    </template>
  </SupportBlock>

  <!-- Divider -->
  <div class="border-t border-gray-100 dark:border-white/5" />

  <!-- Block 2: Become a donor -->
  <SupportBlock
    id="donatie"
    :title="acf?.donation?.title ?? 'Donateur worden'"
    :content="acf?.donation?.content"
    :image-src="acf?.donation?.image"
    :image-alt="acf?.donation?.image_alt ?? 'Deelnemers op de piste'"
    image-position="right"
  >
    <template #cta>
      <IDealFlow />
    </template>
  </SupportBlock>

  <!-- Divider -->
  <div class="border-t border-gray-100 dark:border-white/5" />

  <!-- Block 3: Become a sponsor -->
  <SupportBlock
    id="sponsoren"
    :title="acf?.sponsor?.title ?? 'Sponsor worden'"
    :content="acf?.sponsor?.content"
    :image-src="acf?.sponsor?.image"
    :image-alt="acf?.sponsor?.image_alt ?? 'SWG sponsors'"
    image-position="left"
  >
    <template #cta>
      <BaseButton to="/contact">Neem contact op →</BaseButton>
    </template>
  </SupportBlock>

  <!-- Sponsor logos -->
  <SponsorGrid
    :eyebrow="acf?.sponsors_eyebrow ?? 'Mede mogelijk gemaakt door'"
    :title="acf?.sponsors_title ?? 'Onze sponsors'"
    :intro="acf?.sponsors_intro"
  />
</template>
