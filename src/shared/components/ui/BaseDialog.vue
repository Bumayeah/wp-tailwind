<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title?: string
  closeLabel?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')

const widthClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}[props.maxWidth ?? 'lg']))

watch(() => props.open, (val) => {
  if (val) dialogRef.value?.showModal()
  else dialogRef.value?.close()
})

function onClose() {
  emit('close')
}

function onDialogClick(e: MouseEvent) {
  const rect = dialogRef.value?.getBoundingClientRect()
  if (!rect) return
  const clickedOutside =
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  if (clickedOutside) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    :class="[
      'rounded-2xl shadow-2xl p-0 bg-white dark:bg-dark text-dark dark:text-white w-full mx-auto',
      'max-h-[90vh] overflow-y-auto',
      'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
      'open:animate-[dialog-in_0.2s_ease-out]',
      '[&:not([open])]:hidden',
      widthClass,
    ]"
    :aria-label="title"
    @close="onClose"
    @cancel.prevent="emit('close')"
    @click="onDialogClick"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="min-w-0 flex-1">
          <slot v-if="$slots.header" name="header" />
          <h2 v-else-if="title" class="text-xl font-semibold">{{ title }}</h2>
        </div>
        <button
          type="button"
          :aria-label="closeLabel ?? 'Sluiten'"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-muted hover:text-dark dark:hover:text-white shrink-0 ml-4"
          @click="emit('close')"
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <slot />
    </div>
  </dialog>
</template>
