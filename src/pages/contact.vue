<script setup lang="ts">
import { apiPost } from '@/shared/services/api'
import { pageService } from '@/shared/services/page.service'
import { useForm } from 'vee-validate'

const { data: page } = useQuery({
  queryKey: ['pages', 'contact'],
  queryFn: () => pageService.getBySlug('contact'),
  staleTime: 30 * 60 * 1000,
})
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import CtaBlock from '@/shared/components/CtaBlock.vue'

useHead(computed(() => ({
  title: `${page.value?.title.rendered ?? 'Contact'}`,
  meta: [{ name: 'description', content: page.value?.acf?.hero_description ?? '' }],
})))

const schema = toTypedSchema(
  z.object({
    naam: z.string({ required_error: 'Verplicht' }).min(2, 'Vul je naam in'),
    email: z.string({ required_error: 'Verplicht' }).email('Vul een geldig e-mailadres in'),
    telefoon: z.string().optional(),
    bericht: z.string({ required_error: 'Verplicht' }).min(10, 'Vul een bericht in van minimaal 10 tekens'),
    privacy: z.literal(true, { errorMap: () => ({ message: 'Je moet akkoord gaan met de privacyverklaring' }) }),
    honeypot: z.string().max(0).optional(),
  }),
)

const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({ validationSchema: schema })

const [naam, naamAttrs] = defineField('naam')
const [email, emailAttrs] = defineField('email')
const [telefoon, telefoonAttrs] = defineField('telefoon')
const [bericht, berichtAttrs] = defineField('bericht')
const [privacy, privacyAttrs] = defineField('privacy')
const [honeypot] = defineField('honeypot')

const submitted = ref(false)
const inputClass = useInputClass()

const onSubmit = handleSubmit(async (values) => {
  await apiPost('/gf/v2/forms/2/submissions', {
    input_1: values.naam,
    input_2: values.email,
    input_3: values.telefoon ?? '',
    input_4: values.bericht,
  })
  resetForm()
  submitted.value = true
})
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Contact'"
    :title="page?.title?.rendered ?? 'Contact'"
    :description="page?.acf?.hero_description"
  />

  <AppSection tag="div">
    <SidebarLayout>

      <!-- Form -->
      <div class="lg:pr-32">
        <!-- Success state -->
        <AlertBanner v-if="submitted" variant="success" size="lg" role="status" aria-live="polite">
          <svg class="w-12 h-12 text-success mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2 dark:text-white">Bericht ontvangen!</h2>
          <p class="text-muted">Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>
          <BaseButton variant="secondary" class="mt-6" @click="submitted = false">
            Nog een bericht sturen
          </BaseButton>
        </AlertBanner>

        <!-- Form -->
        <form v-else novalidate class="space-y-5" @submit.prevent="onSubmit">
          <!-- Honeypot -->
          <input v-model="honeypot" type="text" name="website" autocomplete="off" class="sr-only" tabindex="-1" aria-hidden="true" />

          <!-- Name -->
          <BaseFormField id="naam" label="Naam" :error="errors.naam" required>
            <input id="naam" v-model="naam" v-bind="naamAttrs" type="text" autocomplete="name" :class="inputClass(!!errors.naam)" />
          </BaseFormField>

          <!-- Email -->
          <BaseFormField id="email" label="E-mailadres" :error="errors.email" required>
            <input id="email" v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" :class="inputClass(!!errors.email)" />
          </BaseFormField>

          <!-- Phone (optional) -->
          <BaseFormField id="telefoon" label="Telefoonnummer" optional>
            <input id="telefoon" v-model="telefoon" v-bind="telefoonAttrs" type="tel" autocomplete="tel" :class="inputClass(false)" />
          </BaseFormField>

          <!-- Message -->
          <BaseFormField id="bericht" label="Bericht" :error="errors.bericht" required>
            <textarea
              id="bericht"
              v-model="bericht"
              v-bind="berichtAttrs"
              rows="5"
              :class="[inputClass(!!errors.bericht), 'resize-none']"
            />
          </BaseFormField>

          <!-- Privacy consent -->
          <div>
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="privacy"
                v-bind="privacyAttrs"
                type="checkbox"
                class="mt-0.5 rounded border-gray-300 dark:border-white/20 text-primary-500 focus:ring-primary-500"
              />
              <span class="text-sm text-muted">
                Ik ga akkoord met de
                <RouterLink to="/privacy" class="text-primary-500 hover:underline">privacyverklaring</RouterLink>.
                <span class="text-red-500" aria-hidden="true"> *</span>
              </span>
            </label>
            <p v-if="errors.privacy" role="alert" class="text-sm text-red-500 mt-1">{{ errors.privacy }}</p>
          </div>

          <BaseButton type="submit" :disabled="isSubmitting" class="w-full justify-center">
            {{ isSubmitting ? 'Versturen…' : 'Verstuur bericht →' }}
          </BaseButton>
        </form>
      </div>

      <template #sidebar>
      <div class="space-y-4">

        <!-- Contact details card -->
        <BaseCard>
          <h2 class="text-base font-semibold mb-4 dark:text-white">Contactgegevens</h2>
          <dl class="space-y-3 text-sm text-muted">
            <div class="flex items-start gap-3">
              <dt class="sr-only">Organisatie</dt>
              <svg class="w-5 h-5 mt-0.5 shrink-0 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 2.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zm2.5-.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 2.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clip-rule="evenodd" />
              </svg>
              <dd>Stichting Wintersport Gehandicapten Nederland</dd>
            </div>
            <div class="flex items-start gap-3">
              <dt class="sr-only">E-mail</dt>
              <svg class="w-5 h-5 mt-0.5 shrink-0 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <dd><a href="mailto:info@swg-nederland.nl" class="hover:text-primary-500 transition-colors">info@swg-nederland.nl</a></dd>
            </div>
          </dl>
        </BaseCard>

        <!-- Register card -->
        <BaseCard>
          <h2 class="text-base font-semibold mb-2 dark:text-white">Aanmelden voor een reis?</h2>
          <p class="text-sm text-muted mb-4">Schrijf je in voor een van onze groepsreizen op de agendapagina.</p>
          <BaseButton to="/agenda" variant="secondary" size="sm">Bekijk reizen →</BaseButton>
        </BaseCard>

        <!-- Volunteer card -->
        <BaseCard variant="accent">
          <h2 class="text-base font-semibold mb-2 dark:text-white">Meedoen als vrijwilliger?</h2>
          <p class="text-sm text-muted mb-4">We zijn altijd op zoek naar enthousiaste begeleiders. Stuur ons een bericht of bel ons op.</p>
          <BaseButton to="/over-ons" variant="ghost" size="sm">Meer over vrijwilligerswerk →</BaseButton>
        </BaseCard>

      </div>
      </template>

    </SidebarLayout>
  </AppSection>

<CtaBlock heading="Steun SWG Nederland" />
</template>
