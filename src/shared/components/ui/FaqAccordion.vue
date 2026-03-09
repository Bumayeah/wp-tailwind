<script setup lang="ts">
const props = defineProps<{
  items: { question: string; answer: string }[]
  multiple?: boolean
}>()

const openIndexes = ref<Set<number>>(new Set())

function toggle(i: number) {
  if (openIndexes.value.has(i)) {
    openIndexes.value.delete(i)
  } else {
    if (!props.multiple) openIndexes.value.clear()
    openIndexes.value.add(i)
  }
  // trigger reactivity
  openIndexes.value = new Set(openIndexes.value)
}
</script>

<template>
  <dl class="divide-y divide-gray-200 dark:divide-white/10">
    <div v-for="(item, i) in items" :key="i">
      <dt>
        <button
          type="button"
          :aria-expanded="openIndexes.has(i)"
          class="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          @click="toggle(i)"
        >
          <span>{{ item.question }}</span>
          <svg
            :class="['w-5 h-5 flex-shrink-0 transition-transform duration-300', openIndexes.has(i) ? 'rotate-180' : '']"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </dt>
      <dd
        :style="{
          display: 'grid',
          gridTemplateRows: openIndexes.has(i) ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }"
      >
        <div class="overflow-hidden">
          <p class="pb-5 text-muted leading-relaxed">{{ item.answer }}</p>
        </div>
      </dd>
    </div>
  </dl>
</template>
