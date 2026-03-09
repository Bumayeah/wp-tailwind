<script setup lang="ts">
import { computed, onErrorCaptured } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useHead } from '@unhead/vue'
import { pageService } from '@/shared/services/page.service'

const { data: siteOptions } = useQuery({
  queryKey: ['site-options'],
  queryFn: pageService.getSiteOptions,
  staleTime: 60 * 60 * 1000,
})

useHead(computed(() => ({
  titleTemplate: (title?: string) => {
    const name = siteOptions.value?.site_name ?? 'SWG Nederland'
    return title ? `${title} — ${name}` : name
  },
})))

onErrorCaptured((err: unknown, _instance, info: string) => {
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
