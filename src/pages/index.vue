<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'
import type { Stat, Feature } from '@/shared/schemas/page.schema'

interface HomeAcf {
  hero_tagline?: string
  hero_headline?: string
  hero_description?: string
  stats?: Stat[]
  mission_eyebrow?: string
  mission_title?: string
  mission_intro?: string
  mission_body?: string
  mission_highlights?: string[]
  founded_year_text?: string
  founded_year_detail?: string
  why_swg_eyebrow?: string
  why_swg_title?: string
  why_swg_description?: string
  why_swg_features?: Feature[]
  agenda_preview_eyebrow?: string
  agenda_preview_title?: string
  testimonials_eyebrow?: string
  testimonials_title?: string
  sponsors_eyebrow?: string
  sponsors_title?: string
  cta_heading?: string
  cta_body?: string
}

const { data: homePage } = useQuery({
  queryKey: ['pages', 'home'],
  queryFn: () => pageService.getBySlug('home'),
  staleTime: 30 * 60 * 1000,
})

const acf = computed(() => homePage.value?.acf as HomeAcf | undefined)

useHead(computed(() => ({
  title: acf.value?.hero_headline ?? 'Skiën voor iedereen',
  meta: [
    { name: 'description', content: acf.value?.hero_description ?? '' },
    { property: 'og:title', content: acf.value?.hero_headline ?? 'SWG Nederland' },
    { property: 'og:description', content: acf.value?.hero_description ?? '' },
    { property: 'og:type', content: 'website' },
  ],
})))
</script>

<template>
  <HeroVideo
    :tagline="acf?.hero_tagline ?? 'Skiën voor iedereen'"
    :headline="acf?.hero_headline ?? 'Skiën met een beperking? Dat kan!'"
    :description="acf?.hero_description ?? ''"
  />
  <StatsBar
    :stats="acf?.stats ?? []"
  />
  <WhySWG
    :eyebrow="acf?.why_swg_eyebrow ?? 'Waarom SWG Nederland?'"
    :title="acf?.why_swg_title ?? 'Skiën dat voor iedereen werkt'"
    :description="acf?.why_swg_description ?? ''"
    :features="acf?.why_swg_features ?? []"
  />
  <MissionBlock
    :eyebrow="acf?.mission_eyebrow ?? 'Onze missie'"
    :title="acf?.mission_title ?? 'Skiën zou voor iedereen bereikbaar moeten zijn'"
    :intro="acf?.mission_intro ?? ''"
    :body="acf?.mission_body ?? ''"
    :highlights="acf?.mission_highlights ?? []"
    :founded-text="acf?.founded_year_text ?? 'Al 15 jaar actief'"
    :founded-detail="acf?.founded_year_detail ?? 'Opgericht in 2009'"
  />
  <AgendaPreview
    :eyebrow="acf?.agenda_preview_eyebrow ?? 'Aankomende reizen'"
    :title="acf?.agenda_preview_title ?? 'Ski met ons mee'"
  />
  <TestimonialBlock
    :eyebrow="acf?.testimonials_eyebrow ?? 'Ervaringen'"
    :title="acf?.testimonials_title ?? 'Wat deelnemers zeggen'"
  />
  <SponsorGrid
    :eyebrow="acf?.sponsors_eyebrow ?? 'Mede mogelijk gemaakt door'"
    :title="acf?.sponsors_title ?? 'Onze sponsors'"
  />

  <CtaBlock
    variant="simple"
    :heading="acf?.cta_heading ?? 'Klaar om mee te gaan?'"
    :body="acf?.cta_body ?? 'Schrijf je in voor een van onze groepsreizen en maak een onvergetelijke week mee op de piste.'"
    :actions="[
      { label: 'Bekijk alle reizen', to: '/agenda', variant: 'secondary' },
      { label: 'Neem contact op', to: '/contact', variant: 'outline' },
    ]"
  />
</template>
