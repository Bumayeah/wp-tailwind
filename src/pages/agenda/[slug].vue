<script setup lang="ts">
import { agendaService } from '@/features/agenda/agenda.service'
import { getAvailabilityStatus } from '@/features/agenda/agenda.schema'
import { userService } from '@/features/user/user.service'
import type { Registration } from '@/features/user/user.service'
import AvailabilityBadge from '@/features/agenda/components/AvailabilityBadge.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const auth = useAuthStore()
const ui = useUiStore()
const queryClient = useQueryClient()

const { data: trip, isPending, isError } = useQuery({
  queryKey: ['agenda', slug],
  queryFn: () => agendaService.getBySlug(slug.value),
  staleTime: 5 * 60 * 1000,
})

const { data: registrations } = useQuery({
  queryKey: ['mijn', 'registrations'],
  queryFn: userService.getRegistrations,
  enabled: computed(() => auth.isLoggedIn),
  staleTime: 5 * 60 * 1000,
})

const isPast = computed(() => trip.value ? new Date(trip.value.date_from) < new Date() : false)
const status = computed(() => trip.value ? getAvailabilityStatus(trip.value) : 'full' as const)

// Registration deadline: explicit field or fall back to date_from
const registrationDeadline = computed(() =>
  trip.value ? new Date(trip.value.registration_deadline ?? trip.value.date_from) : null,
)
const isRegistrationOpen = computed(() =>
  registrationDeadline.value ? new Date() < registrationDeadline.value : false,
)

// Active registration for this trip (not cancelled)
const myRegistration = computed(() =>
  registrations.value?.find(r => r.trip_id === trip.value?.id && r.status !== 'cancelled') ?? null,
)

const isCancelling = ref(false)
async function cancelRegistration() {
  if (!myRegistration.value) return
  const registrationId = myRegistration.value.id
  isCancelling.value = true
  try {
    await userService.cancelRegistration(registrationId)
    queryClient.setQueryData<Registration[]>(['mijn', 'registrations'], (old) =>
      old?.map(r => r.id === registrationId ? { ...r, status: 'cancelled' as const } : r) ?? [],
    )
    if (trip.value) {
      await agendaService.patchSpots(trip.value.id, trip.value.spots_available + 1)
    }
    await queryClient.invalidateQueries({ queryKey: ['mijn', 'registrations'] })
    await queryClient.invalidateQueries({ queryKey: ['agenda'] })
  } finally {
    isCancelling.value = false
  }
}

const { formatDateRange, formatDate, formatCurrency } = useFormatting()
const router = useRouter()

// True when we're exactly on /agenda/:slug (not a child like /aanmelden)
const isBaseRoute = computed(() => route.path === `/agenda/${slug.value}`)

useHead(computed(() => ({
  title: trip.value ? `${trip.value.title}` : 'Reis',
})))
</script>

<template>
  <!-- Registration modal (child route: /aanmelden) -->
  <BaseDialog :open="!isBaseRoute" max-width="2xl" @close="router.push(`/agenda/${slug}`)">
    <template v-if="trip" #header>
      <div>
        <p class="text-accent-500 mb-0.5 text-xs font-semibold tracking-widest uppercase">
          Aanmelden
        </p>
        <p class="font-bold leading-snug">{{ trip.title }}</p>
        <p class="text-muted mt-0.5 text-xs">
          {{ trip.location }} · {{ formatDateRange(trip.date_from, trip.date_to) }} · {{ formatCurrency(trip.price) }}
        </p>
      </div>
    </template>
    <RouterView />
  </BaseDialog>

  <!-- Loading -->
  <div v-if="isPending" class="container mx-auto px-4 py-16 space-y-6">
    <BaseSkeleton class="h-12 w-2/3" />
    <BaseSkeleton class="h-6 w-1/3" />
    <BaseSkeleton class="h-64 w-full" />
  </div>

  <!-- Error -->
  <div v-else-if="isError" class="container mx-auto px-4 py-16">
    <ErrorState
      title="Reis niet gevonden"
      description="Deze reis bestaat niet of is niet meer beschikbaar."
      :retry="undefined"
    >
      <template #default>
        <BaseButton to="/agenda" variant="secondary" class="mt-4">← Terug naar reizen</BaseButton>
      </template>
    </ErrorState>
  </div>

  <template v-else-if="trip">
    <!-- Hero -->
    <PageHero
      :title="trip.title"
      :image-src="trip.image"
      back-to="/agenda"
      back-label="Alle reizen"
    >
      <div class="flex flex-wrap items-center gap-4 text-white/70">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
          </svg>
          {{ trip.location }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
          </svg>
          {{ formatDateRange(trip.date_from, trip.date_to) }}
        </span>
        <span class="font-semibold text-white text-lg">{{ formatCurrency(trip.price) }}</span>
      </div>
    </PageHero>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid gap-10 lg:grid-cols-3">

        <!-- Main info -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Description -->
          <section aria-labelledby="description-title">
            <h2 id="description-title" class="text-2xl font-semibold mb-4">Over deze reis</h2>
            <p class="text-muted leading-relaxed">{{ trip.description }}</p>
          </section>

          <!-- Program -->
          <section v-if="trip.acf?.program" aria-labelledby="program-title">
            <h2 id="program-title" class="text-2xl font-semibold mb-4">Programma</h2>
            <SanitizedHtml :html="trip.acf.program" class="prose prose-sm max-w-none text-muted" />
          </section>

          <!-- Included -->
          <section v-if="trip.acf?.included" aria-labelledby="included-title">
            <h2 id="included-title" class="text-2xl font-semibold mb-4">Wat is inbegrepen?</h2>
            <SanitizedHtml :html="trip.acf.included" class="prose prose-sm max-w-none text-muted" />
          </section>

          <!-- Gallery (past trips only) -->
          <section v-if="isPast && trip.acf?.gallery?.length" aria-labelledby="gallery-title">
            <h2 id="gallery-title" class="text-2xl font-semibold mb-4">Foto's</h2>
            <PhotoGrid :photos="trip.acf.gallery" />
          </section>

          <!-- Testimonials (past trips only) -->
          <section v-if="isPast && trip.acf?.testimonials?.length" aria-labelledby="reviews-title">
            <h2 id="reviews-title" class="text-2xl font-semibold mb-6">Wat deelnemers zeiden</h2>
            <ul role="list" class="space-y-4">
              <li v-for="item in trip.acf.testimonials" :key="item.name">
                <blockquote class="bg-gray-50 dark:bg-white/5 rounded-2xl p-6">
                  <svg class="w-6 h-6 text-primary-500/30 mb-3" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                    <path d="M10 8C6.134 8 3 11.134 3 15v9h9v-9H6c0-2.206 1.794-4 4-4V8zm19 0c-3.866 0-7 3.134-7 7v9h9v-9h-6c0-2.206 1.794-4 4-4V8z" />
                  </svg>
                  <p class="text-muted leading-relaxed mb-3">"{{ item.quote }}"</p>
                  <footer class="text-sm font-semibold">{{ item.name }}</footer>
                </blockquote>
              </li>
            </ul>
          </section>

        </div>

        <!-- Sidebar: availability + CTA -->
        <aside aria-label="Aanmelding" class="lg:sticky lg:top-28 h-fit">
          <BaseCard variant="elevated" class="space-y-5">

            <!-- Past trip notice -->
            <div v-if="isPast" class="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-4">
              Deze reis heeft plaatsgevonden en is niet meer beschikbaar voor aanmelding.
            </div>

            <template v-else>
              <!-- Price -->
              <div>
                <p class="text-sm text-muted mb-1">Prijs per persoon</p>
                <p class="text-3xl font-bold text-primary-500">{{ formatCurrency(trip.price) }}</p>
              </div>

              <!-- Availability progress bar -->
              <div>
                <div
                  role="progressbar"
                  :aria-valuenow="trip.spots_total - trip.spots_available"
                  :aria-valuemin="0"
                  :aria-valuemax="trip.spots_total"
                  :aria-label="`${trip.spots_total - trip.spots_available} van ${trip.spots_total} plekken bezet`"
                  class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10 mb-2"
                >
                  <div
                    :class="[
                      'h-full rounded-full transition-all duration-500',
                      status === 'available' ? 'bg-success' : status === 'limited' ? 'bg-warning' : 'bg-muted',
                    ]"
                    :style="{ width: `${((trip.spots_total - trip.spots_available) / trip.spots_total) * 100}%` }"
                  />
                </div>
                <p class="text-sm text-muted" aria-hidden="true">
                  {{ trip.spots_total - trip.spots_available }} van {{ trip.spots_total }} plekken bezet
                </p>
              </div>

              <AvailabilityBadge
                :status="status"
                :spots-available="trip.spots_available"
                :spots-total="trip.spots_total"
              />

              <!-- CTA: not logged in -->
              <template v-if="!auth.isLoggedIn">
                <p class="text-sm text-muted">Je moet ingelogd zijn om je aan te melden voor deze reis.</p>
                <div class="flex flex-col gap-2">
                  <BaseButton
                    class="w-full justify-center"
                    @click="ui.openAuthModal({ view: 'login', redirectTo: `/agenda/${trip.slug}/aanmelden` })"
                  >
                    Inloggen →
                  </BaseButton>
                  <BaseButton
                    variant="secondary"
                    class="w-full justify-center"
                    @click="ui.openAuthModal({ view: 'register' })"
                  >
                    Account aanmaken
                  </BaseButton>
                </div>
              </template>

              <!-- CTA: logged in + already registered -->
              <template v-else-if="myRegistration">
                <div class="rounded-xl p-3 text-sm flex items-center gap-2"
                  :class="myRegistration.status === 'waitlist' ? 'bg-accent-500/10 text-accent-500' : 'bg-success/10 text-success'"
                >
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                  {{ myRegistration.status === 'waitlist' ? 'Je staat op de wachtlijst.' : 'Je bent aangemeld voor deze reis.' }}
                </div>
                <div v-if="isRegistrationOpen" class="space-y-1">
                  <BaseButton
                    variant="ghost"
                    class="w-full justify-center text-error! hover:bg-red-50! dark:hover:bg-red-950/20!"
                    :disabled="isCancelling"
                    @click="cancelRegistration"
                  >
                    {{ isCancelling ? 'Bezig…' : 'Afmelden' }}
                  </BaseButton>
                  <p class="text-xs text-center text-muted">
                    Afmelden is mogelijk tot {{ new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(registrationDeadline!) }}
                  </p>
                </div>
                <p v-else class="text-xs text-muted text-center">Afmelden is niet meer mogelijk.</p>
              </template>

              <!-- CTA: logged in + not yet registered -->
              <template v-else>
                <template v-if="isRegistrationOpen">
                  <div v-if="status === 'available' || status === 'limited'">
                    <BaseButton :to="`/agenda/${trip.slug}/aanmelden`" class="w-full justify-center">
                      Aanmelden →
                    </BaseButton>
                  </div>
                  <div v-else-if="status === 'waitlist'" class="space-y-2">
                    <p class="text-sm text-muted">Je kunt je aanmelden voor de wachtlijst. We nemen contact op als er een plek vrijkomt.</p>
                    <BaseButton :to="`/agenda/${trip.slug}/aanmelden`" variant="secondary" class="w-full justify-center">
                      Op wachtlijst →
                    </BaseButton>
                  </div>
                  <div v-else class="space-y-2">
                    <p class="text-sm text-muted">Er zijn geen plekken meer beschikbaar en de wachtlijst is gesloten.</p>
                    <BaseButton to="/agenda" variant="ghost" class="w-full justify-center">
                      Bekijk andere reizen
                    </BaseButton>
                  </div>
                </template>
                <div v-else class="text-sm text-muted bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                  De aanmeldingstermijn voor deze reis is gesloten.
                </div>
              </template>
            </template>

          </BaseCard>
        </aside>

      </div>
    </div>
  </template>
</template>
