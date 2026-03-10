<script setup lang="ts">
import type { BoardMember } from '../board.schema'

const props = defineProps<{ member: BoardMember }>()

const photoUrl = computed(() => props.member.photo || null)

const initials = computed(() =>
  props.member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <div class="h-full flex gap-5 bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-5">
    <!-- Photo + name + role -->
    <div class="basis-1/3 shrink-0 flex flex-col gap-3">
      <div class="w-full h-56 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
        <img
          v-if="photoUrl"
          :src="photoUrl"
          :alt="member.name"
          class="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-primary-500 font-bold text-3xl bg-primary-50 dark:bg-primary-900/20"
          aria-hidden="true"
        >
          {{ initials }}
        </div>
      </div>
      <div>
        <p class="font-bold text-xl leading-snug">{{ member.name }}</p>
        <p class="text-xs font-semibold text-primary-500 uppercase tracking-wide mt-1">{{ member.role }}</p>
      </div>
    </div>

    <!-- Bio -->
    <p v-if="member.bio" class="text-sm text-muted leading-relaxed whitespace-pre-line min-w-0">{{ member.bio }}</p>
  </div>
</template>
