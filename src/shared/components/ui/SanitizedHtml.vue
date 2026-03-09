<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{
  html: string
  class?: string
}>()

const clean = computed(() =>
  DOMPurify.sanitize(props.html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  }),
)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div :class="$props.class" v-html="clean" />
</template>
