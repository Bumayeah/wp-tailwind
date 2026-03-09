<script setup lang="ts">
import { agendaService } from '@/features/agenda/agenda.service'
import { getAvailabilityStatus } from '@/features/agenda/agenda.schema'
import { userService } from '@/features/user/user.service'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const route = useRoute('/agenda/[slug]/aanmelden')
const slug = computed(() => route.params.slug)
const auth = useAuthStore()
const ui = useUiStore()
const queryClient = useQueryClient()

const {
  data: trip,
  isPending,
  isError,
  refetch: refetchTrip,
} = useQuery({
  queryKey: ['agenda', slug],
  queryFn: () => agendaService.getBySlug(slug.value),
  staleTime: 5 * 60 * 1000,
})

const status = computed(() => (trip.value ? getAvailabilityStatus(trip.value) : ('full' as const)))
const isWaitlist = computed(() => status.value === 'waitlist')
const isFull = computed(() => status.value === 'full')

useHead(
  computed(() => ({
    title: trip.value
      ? `Aanmelden: ${trip.value.title}`
      : 'Aanmelden',
  })),
)


const schema = toTypedSchema(
  z.object({
    naam: z.string({ required_error: 'Verplicht' }).min(2, 'Vul je naam in'),
    email: z.string({ required_error: 'Verplicht' }).email('Vul een geldig e-mailadres in'),
    telefoon: z.string({ required_error: 'Verplicht' }).min(6, 'Vul je telefoonnummer in'),
    aard_beperking: z
      .string({ required_error: 'Verplicht' })
      .min(2, 'Vul de aard van je beperking in'),
    begeleider: z.enum(['ja', 'nee'], { errorMap: () => ({ message: 'Kies een optie' }) }),
    dieetwensen: z.string().optional(),
    noodcontact_naam: z.string({ required_error: 'Verplicht' }).min(2, 'Vul naam noodcontact in'),
    noodcontact_telefoon: z
      .string({ required_error: 'Verplicht' })
      .min(6, 'Vul telefoonnummer noodcontact in'),
    privacy: z.literal(true, {
      errorMap: () => ({ message: 'Je moet akkoord gaan met de privacyverklaring' }),
    }),
    honeypot: z.string().max(0).optional(),
  }),
)

const { handleSubmit, defineField, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
})

// Prefill from auth user if logged in
watchEffect(() => {
  if (auth.user) {
    setValues({
      naam: auth.user.name,
      email: auth.user.email,
      telefoon: auth.user.phone,
    })
  }
})

const [naam, naamAttrs] = defineField('naam')
const [email, emailAttrs] = defineField('email')
const [telefoon, telefoonAttrs] = defineField('telefoon')
const [aard_beperking, aardBeperkingAttrs] = defineField('aard_beperking')
const [begeleider, begeleiderAttrs] = defineField('begeleider')
const [dieetwensen, dieetwensenAttrs] = defineField('dieetwensen')
const [noodcontact_naam, noodcontactNaamAttrs] = defineField('noodcontact_naam')
const [noodcontact_telefoon, noodcontactTelefoonAttrs] = defineField('noodcontact_telefoon')
const [privacy, privacyAttrs] = defineField('privacy')
const [honeypot] = defineField('honeypot')

const submitted = ref(false)

const onSubmit = handleSubmit(async (_values) => {
  if (!auth.user || !trip.value) return

  await userService.createRegistration({
    user_id: auth.user.id,
    trip_id: trip.value.id,
    trip_title: trip.value.title,
    date_from: trip.value.date_from,
    date_to: trip.value.date_to,
    location: trip.value.location,
    status: isWaitlist.value ? 'waitlist' : 'confirmed',
  })

  if (!isWaitlist.value && trip.value.spots_available > 0) {
    await agendaService.patchSpots(trip.value.id, trip.value.spots_available - 1)
    await refetchTrip()
  }

  await queryClient.invalidateQueries({ queryKey: ['mijn', 'registrations'] })

  resetForm()
  submitted.value = true
})

const inputClass = (hasError: boolean) =>
  [
    'w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
    hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/20',
  ].join(' ')
</script>

<template>
  <!-- Loading -->
  <div v-if="isPending" class="space-y-4 p-8">
    <BaseSkeleton class="h-8 w-2/3" />
    <BaseSkeleton class="h-5 w-1/3" />
    <BaseSkeleton class="h-48 w-full" />
  </div>

  <!-- Error / not found -->
  <div v-else-if="isError || !trip" class="p-8">
    <ErrorState
      title="Reis niet gevonden"
      description="Deze reis bestaat niet of is niet meer beschikbaar."
    />
  </div>

  <!-- Closed -->
  <div v-else-if="isFull" class="p-8 text-center">
    <p class="mb-2 text-lg font-semibold">Aanmelding gesloten</p>
    <p class="text-muted mb-4 text-sm">
      Er zijn geen plekken meer beschikbaar en de wachtlijst is gesloten.
    </p>
  </div>

  <template v-else>
    <div class="space-y-6">
      <!-- Login banner (not logged in) -->
      <div
        v-if="!auth.isLoggedIn && !submitted"
        class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
      >
        <div>
          <p class="text-sm font-medium">Heb je al een account?</p>
          <p class="text-muted text-xs">Log in om je gegevens automatisch in te vullen.</p>
        </div>
        <BaseButton
          variant="secondary"
          size="sm"
          @click="ui.openAuthModal({ view: 'login', redirectTo: `/agenda/${slug}/aanmelden` })"
        >
          Inloggen →
        </BaseButton>
      </div>

      <!-- Logged in indicator -->
      <div
        v-else-if="auth.isLoggedIn && !submitted"
        class="bg-success/10 border-success/20 text-success flex items-center gap-2 rounded-xl border p-3 text-sm"
      >
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
        Ingelogd als <strong>{{ auth.user?.name }}</strong> — gegevens zijn vooringevuld.
      </div>

      <!-- Waitlist notice -->
      <div
        v-if="isWaitlist"
        class="bg-accent-500/10 border-accent-500/20 text-accent-500 rounded-xl border p-4 text-sm font-medium"
      >
        Deze reis is vol. Je aanmelding gaat op de wachtlijst — we nemen contact op als er een plek
        vrijkomt.
      </div>

      <!-- Success -->
      <div
        v-if="submitted"
        role="status"
        aria-live="polite"
        class="bg-success/10 border-success/20 rounded-2xl border p-8 text-center"
      >
        <svg
          class="text-success mx-auto mb-4 h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="mb-2 text-xl font-semibold">
          {{ isWaitlist ? 'Op de wachtlijst gezet!' : 'Aanmelding ontvangen!' }}
        </h2>
        <p class="text-muted">We nemen zo snel mogelijk contact met je op ter bevestiging.</p>
      </div>

      <!-- Form -->
      <form v-else novalidate class="space-y-6" @submit.prevent="onSubmit">
        <!-- Honeypot -->
        <input
          v-model="honeypot"
          type="text"
          name="website"
          autocomplete="off"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        />

        <!-- Personal details -->
        <fieldset class="space-y-4">
          <legend class="mb-3 text-base font-semibold dark:text-white">
            Persoonlijke gegevens
          </legend>

          <div>
            <label for="naam" class="mb-1 block text-sm font-medium dark:text-white"
              >Naam <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <input
              id="naam"
              v-model="naam"
              v-bind="naamAttrs"
              type="text"
              autocomplete="name"
              :class="inputClass(!!errors.naam)"
            />
            <p v-if="errors.naam" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.naam }}
            </p>
          </div>

          <div>
            <label for="email" class="mb-1 block text-sm font-medium dark:text-white"
              >E-mailadres <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              autocomplete="email"
              :class="inputClass(!!errors.email)"
            />
            <p v-if="errors.email" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="telefoon" class="mb-1 block text-sm font-medium dark:text-white"
              >Telefoonnummer <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <input
              id="telefoon"
              v-model="telefoon"
              v-bind="telefoonAttrs"
              type="tel"
              autocomplete="tel"
              :class="inputClass(!!errors.telefoon)"
            />
            <p v-if="errors.telefoon" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.telefoon }}
            </p>
          </div>
        </fieldset>

        <!-- Medical info -->
        <fieldset class="space-y-4">
          <legend class="mb-3 text-base font-semibold dark:text-white">Medische informatie</legend>

          <div>
            <label for="aard_beperking" class="mb-1 block text-sm font-medium dark:text-white"
              >Aard van de beperking <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <textarea
              id="aard_beperking"
              v-model="aard_beperking"
              v-bind="aardBeperkingAttrs"
              rows="3"
              :class="inputClass(!!errors.aard_beperking) + ' resize-none'"
            />
            <p v-if="errors.aard_beperking" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.aard_beperking }}
            </p>
          </div>

          <div>
            <label for="dieetwensen" class="mb-1 block text-sm font-medium dark:text-white"
              >Dieetwensen <span class="text-muted text-xs">(optioneel)</span></label
            >
            <input
              id="dieetwensen"
              v-model="dieetwensen"
              v-bind="dieetwensenAttrs"
              type="text"
              class="dark:bg-dark focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-white/20"
            />
          </div>

          <div>
            <p class="mb-2 block text-sm font-medium dark:text-white">
              Kom je met een persoonlijk begeleider?
              <span class="text-red-500" aria-hidden="true">*</span>
            </p>
            <div class="flex gap-4">
              <label class="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  v-model="begeleider"
                  v-bind="begeleiderAttrs"
                  type="radio"
                  value="ja"
                  class="text-primary-500 focus:ring-primary-500"
                />
                Ja
              </label>
              <label class="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  v-model="begeleider"
                  v-bind="begeleiderAttrs"
                  type="radio"
                  value="nee"
                  class="text-primary-500 focus:ring-primary-500"
                />
                Nee
              </label>
            </div>
            <p v-if="errors.begeleider" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.begeleider }}
            </p>
          </div>
        </fieldset>

        <!-- Emergency contact -->
        <fieldset class="space-y-4">
          <legend class="mb-3 text-base font-semibold dark:text-white">Noodcontact</legend>

          <div>
            <label for="noodcontact_naam" class="mb-1 block text-sm font-medium dark:text-white"
              >Naam noodcontact <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <input
              id="noodcontact_naam"
              v-model="noodcontact_naam"
              v-bind="noodcontactNaamAttrs"
              type="text"
              :class="inputClass(!!errors.noodcontact_naam)"
            />
            <p v-if="errors.noodcontact_naam" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.noodcontact_naam }}
            </p>
          </div>

          <div>
            <label for="noodcontact_telefoon" class="mb-1 block text-sm font-medium dark:text-white"
              >Telefoonnummer noodcontact
              <span class="text-red-500" aria-hidden="true">*</span></label
            >
            <input
              id="noodcontact_telefoon"
              v-model="noodcontact_telefoon"
              v-bind="noodcontactTelefoonAttrs"
              type="tel"
              :class="inputClass(!!errors.noodcontact_telefoon)"
            />
            <p v-if="errors.noodcontact_telefoon" role="alert" class="mt-1 text-sm text-red-500">
              {{ errors.noodcontact_telefoon }}
            </p>
          </div>
        </fieldset>

        <!-- Privacy -->
        <div>
          <label class="flex cursor-pointer items-start gap-3">
            <input
              v-model="privacy"
              v-bind="privacyAttrs"
              type="checkbox"
              class="text-primary-500 focus:ring-primary-500 mt-0.5 rounded border-gray-300 dark:border-white/20"
            />
            <span class="text-muted text-sm">
              Ik ga akkoord met de
              <RouterLink to="/privacy" class="text-primary-500 hover:underline"
                >privacyverklaring</RouterLink
              >.
              <span class="text-red-500" aria-hidden="true"> *</span>
            </span>
          </label>
          <p v-if="errors.privacy" role="alert" class="mt-1 text-sm text-red-500">
            {{ errors.privacy }}
          </p>
        </div>

        <BaseButton type="submit" :disabled="isSubmitting" class="w-full justify-center">
          {{
            isSubmitting
              ? 'Versturen…'
              : isWaitlist
                ? 'Op wachtlijst zetten →'
                : 'Aanmelding versturen →'
          }}
        </BaseButton>
      </form>
    </div>
  </template>
</template>
