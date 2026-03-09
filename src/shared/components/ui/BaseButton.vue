<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineOptions({ inheritAttrs: false })

defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  as?: 'button' | 'a'
  href?: string
  to?: RouteLocationRaw
}>()
</script>

<template>
  <!-- Router link variant -->
  <RouterLink
    v-if="to"
    :to="to"
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97',
      // Size
      size === 'sm'
        ? 'px-4 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-8 py-3.5 text-base'
          : 'px-6 py-2.5 text-sm',
      // Variant
      !variant || variant === 'primary'
        ? 'bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 text-white'
        : variant === 'secondary'
          ? 'dark:bg-dark-secondary text-dark border-dark/20 focus-visible:outline-primary-500 border bg-white hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10'
          : variant === 'ghost'
            ? 'text-primary-500 hover:bg-primary-500/10 focus-visible:outline-primary-500 bg-transparent'
            : 'bg-error text-white hover:bg-red-700 focus-visible:outline-red-500',
    ]"
  >
    <slot />
  </RouterLink>

  <!-- External link variant -->
  <a
    v-else-if="as === 'a'"
    :href="href"
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97',
      size === 'sm'
        ? 'px-4 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-8 py-3.5 text-base'
          : 'px-6 py-2.5 text-sm',
      !variant || variant === 'primary'
        ? 'bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 text-white'
        : variant === 'secondary'
          ? 'dark:bg-dark-secondary text-dark border-dark/20 focus-visible:outline-primary-500 border bg-white hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10'
          : variant === 'ghost'
            ? 'text-primary-500 hover:bg-primary-500/10 focus-visible:outline-primary-500 bg-transparent'
            : 'bg-error text-white hover:bg-red-700 focus-visible:outline-red-500',
    ]"
  >
    <slot />
  </a>

  <!-- Default button -->
  <button
    v-else
    v-bind="$attrs"
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :class="[
      'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
      size === 'sm'
        ? 'px-4 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-8 py-3.5 text-base'
          : 'px-6 py-2.5 text-sm',
      !variant || variant === 'primary'
        ? 'bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 text-white'
        : variant === 'secondary'
          ? 'dark:bg-dark-secondary text-dark border-dark/20 focus-visible:outline-primary-500 border bg-white hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10'
          : variant === 'ghost'
            ? 'text-primary-500 hover:bg-primary-500/10 focus-visible:outline-primary-500 bg-transparent'
            : 'bg-error text-white hover:bg-red-700 focus-visible:outline-red-500',
    ]"
  >
    <span
      v-if="loading"
      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
