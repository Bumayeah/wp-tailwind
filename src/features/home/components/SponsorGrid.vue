<script setup lang="ts">
import { sponsorService } from '@/features/steunen/sponsor.service'
import { sortSponsors } from '@/features/steunen/sponsor.schema'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
}>()

const { data: sponsors, isPending } = useQuery({
  queryKey: ['sponsors'],
  queryFn: sponsorService.getAll,
  staleTime: 10 * 60 * 1000,
})

const sorted = computed(() => sortSponsors(sponsors.value ?? []))

function logoUrl(filename: string): string {
  return new URL(`../../../assets/sponsors/${filename}`, import.meta.url).href
}
</script>

<template>
  <AppSection bg="dark" aria-labelledby="sponsors-title" id="sponsoren">

      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        heading-id="sponsors-title"
        align="center"
        theme="inverted"
        :description="intro"
        class="mb-10"
      />

      <!-- Skeletons -->
      <div v-if="isPending" class="flex gap-10 justify-center overflow-hidden">
        <BaseSkeleton v-for="n in 6" :key="n" class="h-12 w-32 shrink-0" />
      </div>

      <!-- Auto-scroll marquee -->
      <div
        v-else
        class="relative overflow-hidden"
        aria-label="Onze sponsors"
      >
        <!-- Fade edges -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-dark to-transparent z-10" aria-hidden="true" />
        <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-dark to-transparent z-10" aria-hidden="true" />

        <!-- Scrolling track: duplicate list so it loops seamlessly -->
        <div
          class="flex items-center gap-12 md:gap-16 w-max animate-marquee hover:pause-marquee"
          aria-hidden="true"
        >
          <!-- Set 1 -->
          <template v-for="sponsor in sorted" :key="`a-${sponsor.id}`">
            <component
              :is="sponsor.url ? 'a' : 'div'"
              :href="sponsor.url || undefined"
              :target="sponsor.url ? '_blank' : undefined"
              :rel="sponsor.url ? 'noopener noreferrer' : undefined"
              :class="[
                'block shrink-0 transition-opacity hover:opacity-80',
                sponsor.tier === 'Goud' ? 'w-36 md:w-44' : sponsor.tier === 'Zilver' ? 'w-28 md:w-36' : 'w-24 md:w-28',
              ]"
            >
              <img
                :src="logoUrl(sponsor.logo)"
                :alt="sponsor.name"
                class="w-full h-12 object-contain"
                loading="lazy"
                decoding="async"
              />
            </component>
          </template>

          <!-- Set 2 (duplicate for seamless loop) -->
          <template v-for="sponsor in sorted" :key="`b-${sponsor.id}`">
            <component
              :is="sponsor.url ? 'a' : 'div'"
              :href="sponsor.url || undefined"
              :target="sponsor.url ? '_blank' : undefined"
              :rel="sponsor.url ? 'noopener noreferrer' : undefined"
              :class="[
                'block shrink-0 transition-opacity hover:opacity-80',
                sponsor.tier === 'Goud' ? 'w-36 md:w-44' : sponsor.tier === 'Zilver' ? 'w-28 md:w-36' : 'w-24 md:w-28',
              ]"
            >
              <img
                :src="logoUrl(sponsor.logo)"
                :alt="sponsor.name"
                class="w-full h-12 object-contain"
                loading="lazy"
                decoding="async"
              />
            </component>
          </template>
        </div>

        <!-- Accessible list (visually hidden) -->
        <ul role="list" class="sr-only">
          <li v-for="sponsor in sorted" :key="sponsor.id">
            <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer">
              {{ sponsor.name }}
            </a>
            <span v-else>{{ sponsor.name }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-10 text-center">
        <BaseButton to="/steunen#sponsoren" variant="ghost" size="sm">
          Sponsor worden →
        </BaseButton>
      </div>

  </AppSection>
</template>
