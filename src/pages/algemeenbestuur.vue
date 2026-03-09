<script setup lang="ts">
import { boardService } from '@/features/board/board.service'
import { sortBoardMembers } from '@/features/board/board.schema'
import BoardCard from '@/features/board/components/BoardCard.vue'
import CtaBlock from '@/shared/components/CtaBlock.vue'
import { pageService } from '@/shared/services/page.service'

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Algemeen bestuur'}`,
  meta: [{ name: 'description', content: page.value?.acf?.hero_description ?? '' }],
})))

const { data: page } = useQuery({
  queryKey: ['pages', 'algemeenbestuur'],
  queryFn: () => pageService.getBySlug('algemeenbestuur'),
  staleTime: 30 * 60 * 1000,
})

const { data: members, isPending, isError } = useQuery({
  queryKey: ['board'],
  queryFn: boardService.getAll,
  staleTime: 10 * 60 * 1000,
})

const sorted = computed(() => sortBoardMembers(members.value ?? []))
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Bestuur'"
    :title="page?.title?.rendered ?? 'Algemeen bestuur'"
    :description="page?.acf?.hero_description"
  />

  <!-- Board grid -->
  <section class="container mx-auto px-4 py-16" aria-labelledby="board-heading">
    <h2 id="board-heading" class="sr-only">Bestuursleden</h2>

    <!-- Loading -->
    <ul v-if="isPending" role="list" class="grid gap-6 md:grid-cols-2">
      <li v-for="n in 5" :key="n" aria-hidden="true">
        <BaseSkeleton class="h-80" />
      </li>
    </ul>

    <!-- Error -->
    <ErrorState v-else-if="isError" description="Bestuursleden konden niet worden geladen." />

    <!-- Members -->
    <ul v-else role="list" class="grid gap-6 md:grid-cols-2">
      <li v-for="member in sorted" :key="member.id" class="h-full">
        <BoardCard :member="member" />
      </li>
    </ul>
  </section>

  <!-- CTA -->
  <CtaBlock
    variant="simple"
    heading="Steun SWG Nederland"
    body="Helpen skiën toegankelijk te maken voor iedereen?"
    :actions="[
      { label: 'Doneer nu', to: '/steunen#donatie' },
      { label: 'Word sponsor', to: '/steunen#sponsoren', variant: 'outline' },
    ]"
  />
</template>
