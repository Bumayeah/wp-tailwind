<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const result: (number | '…')[] = [1]
  if (current > 3) result.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    result.push(i)
  }
  if (current < total - 2) result.push('…')
  result.push(total)
  return result
})

function go(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Paginering" class="flex items-center justify-center gap-1 mt-10">
    <button
      type="button"
      :disabled="currentPage === 1"
      class="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
      aria-label="Vorige pagina"
      @click="go(currentPage - 1)"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
      </svg>
    </button>

    <template v-for="(page, i) in pages" :key="i">
      <span v-if="page === '…'" class="w-9 h-9 flex items-center justify-center text-sm text-muted select-none">…</span>
      <button
        v-else
        type="button"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
          page === currentPage
            ? 'bg-primary-500 text-white'
            : 'hover:bg-gray-100 dark:hover:bg-white/10',
        ]"
        @click="go(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      :disabled="currentPage === totalPages"
      class="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10"
      aria-label="Volgende pagina"
      @click="go(currentPage + 1)"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>
  </nav>
</template>
