<script setup lang="ts">
import { blogService } from '@/features/blog/blog.service'
import BlogCard from '@/features/blog/components/BlogCard.vue'
import { pageService } from '@/shared/services/page.service'

const PER_PAGE = 9

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Nieuws'}`,
  meta: [{ name: 'description', content: page.value?.acf?.hero_description ?? '' }],
})))

const { data: page } = useQuery({
  queryKey: ['pages', 'nieuws'],
  queryFn: () => pageService.getBySlug('nieuws'),
  staleTime: 30 * 60 * 1000,
})

const { data: posts, isPending, isError, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: () => blogService.getPosts(),
  staleTime: 5 * 60 * 1000,
})

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil((posts.value?.length ?? 0) / PER_PAGE))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return (posts.value ?? []).slice(start, start + PER_PAGE)
})

watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Nieuws'"
    :title="page?.title?.rendered ?? 'Nieuws'"
    :description="page?.acf?.hero_description"
  />

  <div class="container mx-auto px-4 py-16">

    <!-- Loading -->
    <div v-if="isPending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-80" />
    </div>

    <!-- Error -->
    <ErrorState v-else-if="isError" description="Nieuwsberichten konden niet worden geladen." :retry="refetch" />

    <template v-else>
      <EmptyState
        v-if="!posts?.length"
        title="Geen berichten"
        description="Er zijn momenteel geen nieuwsberichten. Kom later terug."
      />

      <template v-else>
        <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="post in pagedPosts" :key="post.id">
            <BlogCard :post="post" />
          </li>
        </ul>
        <BasePagination :current-page="currentPage" :total-pages="totalPages" @update:current-page="currentPage = $event" />
      </template>
    </template>

  </div>
</template>
