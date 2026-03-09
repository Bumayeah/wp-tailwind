<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'

const { data: siteOptions } = useQuery({
  queryKey: ['site-options'],
  queryFn: pageService.getSiteOptions,
  staleTime: 60 * 60 * 1000,
})

useHead(computed(() => ({
  titleTemplate: (title) => {
    const name = siteOptions.value?.site_name ?? 'SWG Nederland'
    return title ? `${title} — ${name}` : name
  },
})))

onErrorCaptured((err, _instance, info) => {
  console.error('[App] Uncaught component error', { err, info })
  return false
})
</script>

<template>
  <SkipToMain />
  <TheHeader />
  <AuthModal />
  <main id="main-content" tabindex="-1" class="flex-1">
    <RouterView />
  </main>
  <TheFooter />
</template>
