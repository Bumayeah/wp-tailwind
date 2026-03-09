<script setup lang="ts">
const ui = useUiStore()

const options = [
  { value: 'light' as const, label: 'Light mode', icon: '☀' },
  { value: 'dark' as const, label: 'Dark mode', icon: '☾' },
  { value: 'system' as const, label: 'System theme', icon: '⚙' },
]
</script>

<template>
  <div class="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5" role="group" aria-label="Theme">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :aria-label="opt.label"
      :aria-pressed="ui.theme === opt.value"
      :class="[
        'w-7 h-7 rounded-full text-sm transition-colors',
        ui.theme === opt.value
          ? 'bg-primary-500 text-white'
          : 'text-white/60 hover:text-white',
      ]"
      @click="ui.setTheme(opt.value)"
    >
      {{ opt.icon }}
    </button>
  </div>
</template>
