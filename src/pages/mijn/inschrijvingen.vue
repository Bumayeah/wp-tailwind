<script setup lang="ts">
import { userService } from '@/features/user/user.service'
import type { Registration } from '@/features/user/user.service'

useHead({ title: 'Mijn inschrijvingen' })

const { formatDateRange } = useFormatting()
const queryClient = useQueryClient()

const { data: registrations, isPending } = useQuery({
  queryKey: ['mijn', 'registrations'],
  queryFn: userService.getRegistrations,
})

const statusLabel: Record<string, string> = {
  confirmed: 'Bevestigd',
  waitlist: 'Wachtlijst',
  cancelled: 'Geannuleerd',
}
const statusClass: Record<string, string> = {
  confirmed: 'text-success bg-success/10',
  waitlist: 'text-accent-500 bg-accent-500/10',
  cancelled: 'text-muted bg-muted/10',
}

function weeksUntilTrip(dateFrom: string): number {
  return (new Date(dateFrom).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)
}

function cancellationLabel(item: Registration): string | null {
  if (item.status === 'cancelled') return null
  const weeks = weeksUntilTrip(item.date_from)
  if (weeks < 0) return null
  if (weeks < 2) return null // niet mogelijk online
  if (weeks <= 6) return 'Afmelden (70% kosten)'
  return 'Afmelden'
}

function cancellationNote(item: Registration): string | null {
  if (item.status === 'cancelled') return null
  const weeks = weeksUntilTrip(item.date_from)
  if (weeks >= 0 && weeks < 2) return 'Afmelden niet meer mogelijk online — neem contact op.'
  return null
}

const cancellingId = ref<number | null>(null)

async function cancelRegistration(id: number) {
  cancellingId.value = id
  try {
    await userService.cancelRegistration(id)
    queryClient.setQueryData<Registration[]>(['mijn', 'registrations'], (old) =>
      old?.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r) ?? [],
    )
    queryClient.invalidateQueries({ queryKey: ['agenda'] })
  } catch (e) {
    console.error('Fout bij afmelden', e)
  } finally {
    cancellingId.value = null
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">Mijn inschrijvingen</h2>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-3">
      <BaseSkeleton class="h-20 w-full rounded-xl" />
      <BaseSkeleton class="h-20 w-full rounded-xl" />
    </div>

    <!-- Empty -->
    <div v-else-if="!registrations?.length" class="text-center py-16">
      <p class="text-muted mb-4">Je hebt nog geen inschrijvingen.</p>
      <BaseButton to="/agenda">Bekijk reizen →</BaseButton>
    </div>

    <!-- List -->
    <ul v-else role="list" class="space-y-4">
      <li
        v-for="item in registrations"
        :key="item.id"
        class="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-6"
      >
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 class="font-semibold text-lg">{{ item.trip_title }}</h3>
            <dl class="mt-2 space-y-1 text-sm text-muted">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                </svg>
                <dt class="sr-only">Locatie</dt>
                <dd>{{ item.location }}</dd>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
                </svg>
                <dt class="sr-only">Datum</dt>
                <dd>{{ formatDateRange(item.date_from, item.date_to) }}</dd>
              </div>
            </dl>
          </div>
          <span :class="['text-xs font-semibold px-3 py-1.5 rounded-full shrink-0', statusClass[item.status] ?? 'text-muted bg-muted/10']">
            {{ statusLabel[item.status] ?? item.status }}
          </span>
        </div>

        <!-- Cancellation row -->
        <div v-if="item.status !== 'cancelled'" class="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap">
          <p v-if="cancellationNote(item)" class="text-xs text-muted">{{ cancellationNote(item) }}</p>
          <template v-else-if="cancellationLabel(item)">
            <p class="text-xs text-muted">
              {{ weeksUntilTrip(item.date_from) <= 6 ? 'Annuleren kost 70% van de reissom.' : 'Kosteloos annuleren.' }}
            </p>
            <button
              type="button"
              :disabled="cancellingId === item.id"
              class="text-xs text-red-500 hover:underline disabled:opacity-50 shrink-0"
              @click="cancelRegistration(item.id)"
            >
              {{ cancellingId === item.id ? 'Afmelden…' : cancellationLabel(item) }}
            </button>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>
