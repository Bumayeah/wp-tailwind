<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const PRESET_AMOUNTS = [5, 10, 25, 50]

const schema = toTypedSchema(
  z.object({
    bedrag_preset: z.number().optional(),
    bedrag_eigen: z.string().optional(),
    frequentie: z.enum(['eenmalig', 'jaarlijks']),
    naam: z.string().min(2, 'Vul je naam in'),
    email: z.string().email('Vul een geldig e-mailadres in'),
    honeypot: z.string().max(0).optional(),
  }).refine(
    (d) => d.bedrag_preset || (d.bedrag_eigen && Number(d.bedrag_eigen) >= 1),
    { message: 'Kies een bedrag of vul een eigen bedrag in', path: ['bedrag_preset'] },
  ),
)

const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({ validationSchema: schema })

const [bedragPreset, bedragPresetAttrs] = defineField('bedrag_preset')
const [bedragEigen, bedragEigenAttrs] = defineField('bedrag_eigen')
const [frequentie, frequentieAttrs] = defineField('frequentie', { initialValue: 'eenmalig' })
const [naam, naamAttrs] = defineField('naam')
const [email, emailAttrs] = defineField('email')
const [honeypot] = defineField('honeypot')

const router = useRouter()
const isSimulating = ref(false)
const isDev = import.meta.env.DEV
const inputClass = useInputClass()

const onSubmit = handleSubmit(async (values) => {
  const amount = values.bedrag_preset ?? Number(values.bedrag_eigen)

  // Dev / GitHub Pages: simulate iDEAL — no real payment
  if (import.meta.env.DEV || !import.meta.env.VITE_USE_IDEAL) {
    isSimulating.value = true
    await new Promise((r) => setTimeout(r, 1800))
    isSimulating.value = false
    router.push(`/steunen/bedankt?status=paid&mock=true&amount=${amount}&naam=${encodeURIComponent(values.naam)}`)
    return
  }

  // Production: POST to Gravity Forms → WP returns Mollie checkout URL
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gf/v2/forms/3/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_1: amount,
      input_2: values.frequentie,
      input_3: values.naam,
      input_4: values.email,
    }),
  })

  if (!res.ok) throw new Error('Betaling mislukt')
  const data = await res.json()
  window.location.href = data.checkout_url
})
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="onSubmit">
    <!-- Honeypot -->
    <input v-model="honeypot" type="text" name="website" autocomplete="off" class="sr-only" tabindex="-1" aria-hidden="true" />

    <!-- Amount presets -->
    <fieldset>
      <legend class="text-sm font-medium mb-2">Bedrag</legend>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="amount in PRESET_AMOUNTS"
          :key="amount"
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
            bedragPreset === amount
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 dark:border-white/20 hover:border-primary-500 hover:text-primary-500',
          ]"
          @click="bedragPreset = amount; bedragEigen = ''"
        >
          € {{ amount }}
        </button>
        <button
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
            bedragPreset === undefined && bedragEigen
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 dark:border-white/20 hover:border-primary-500 hover:text-primary-500',
          ]"
          @click="bedragPreset = undefined"
        >
          Eigen bedrag
        </button>
      </div>

      <!-- Custom amount input -->
      <div v-if="bedragPreset === undefined" class="mt-2">
        <label for="bedrag-eigen" class="sr-only">Eigen bedrag in euro's</label>
        <div class="relative w-36">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">€</span>
          <input
            id="bedrag-eigen"
            v-model="bedragEigen"
            v-bind="bedragEigenAttrs"
            type="number"
            min="1"
            placeholder="0"
            class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <p v-if="errors.bedrag_preset" class="text-sm text-red-500 mt-1">{{ errors.bedrag_preset }}</p>
    </fieldset>

    <!-- Frequency -->
    <fieldset>
      <legend class="text-sm font-medium mb-2">Frequentie</legend>
      <div class="flex gap-2">
        <button
          v-for="opt in [{ value: 'eenmalig', label: 'Eenmalig' }, { value: 'jaarlijks', label: 'Jaarlijks' }]"
          :key="opt.value"
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
            frequentie === opt.value
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 dark:border-white/20 hover:border-primary-500 hover:text-primary-500',
          ]"
          @click="frequentie = opt.value as 'eenmalig' | 'jaarlijks'"
        >
          {{ opt.label }}
        </button>
      </div>
    </fieldset>

    <!-- Name -->
    <BaseFormField id="naam" label="Naam" :error="errors.naam">
      <input id="naam" v-model="naam" v-bind="naamAttrs" type="text" autocomplete="name" :class="inputClass(!!errors.naam)" />
    </BaseFormField>

    <!-- Email -->
    <BaseFormField id="email" label="E-mailadres" :error="errors.email">
      <input id="email" v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" :class="inputClass(!!errors.email)" />
    </BaseFormField>

    <!-- Submit -->
    <BaseButton type="submit" :disabled="isSubmitting || isSimulating" class="w-full justify-center">
      <template v-if="isSimulating">
        <svg class="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Doorsturen naar bank…
      </template>
      <template v-else>
        Doneer via iDEAL →
      </template>
    </BaseButton>

    <p v-if="isDev" class="text-xs text-muted text-center">Simulatiemodus — geen echte betaling</p>
  </form>
</template>
