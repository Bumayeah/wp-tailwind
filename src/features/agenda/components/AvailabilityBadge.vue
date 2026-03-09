<script setup lang="ts">
import type { AvailabilityStatus } from '../agenda.schema'
import { AVAILABILITY_LABEL, AVAILABILITY_COLOR } from '../agenda.schema'

defineProps<{
  status: AvailabilityStatus
  spotsAvailable: number
  spotsTotal: number
}>()
</script>

<template>
  <span
    role="status"
    :class="['inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full', AVAILABILITY_COLOR[status]]"
  >
    <span
      :class="[
        'inline-block w-2 h-2 rounded-full',
        status === 'available' ? 'bg-success' : status === 'limited' ? 'bg-warning' : status === 'waitlist' ? 'bg-primary-500' : 'bg-muted',
      ]"
      aria-hidden="true"
    />
    <template v-if="status === 'available'">{{ spotsAvailable }} plekken beschikbaar</template>
    <template v-else-if="status === 'limited'">Nog maar {{ spotsAvailable }} plekken!</template>
    <template v-else-if="status === 'waitlist'">Vol — wachtlijst open</template>
    <template v-else>Vol</template>
  </span>
</template>
