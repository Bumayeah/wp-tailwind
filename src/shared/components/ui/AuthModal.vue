<script setup lang="ts">
import { accountService } from '@/features/account/account.service'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()
const inputClass = useInputClass()

const dialogRef = ref<HTMLDialogElement | null>(null)
const view = ref<'login' | 'register'>('login')
const registerSubmitted = ref(false)

watch(() => ui.authModal.open, (open) => {
  if (open) {
    view.value = ui.authModal.view
    registerSubmitted.value = false
    nextTick(() => dialogRef.value?.showModal())
  } else {
    dialogRef.value?.close()
  }
})

function close() {
  ui.closeAuthModal()
}

// ─── Login ──────────────────────────────────────────────
const {
  handleSubmit: handleLogin,
  defineField: defineLoginField,
  errors: loginErrors,
  isSubmitting: loginSubmitting,
} = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string({ required_error: 'Vul je e-mailadres in' }).email('Vul een geldig e-mailadres in'),
    password: z.string({ required_error: 'Vul je wachtwoord in' }).min(1, 'Vul je wachtwoord in'),
  })),
})

const [loginEmail, loginEmailAttrs] = defineLoginField('email')
const [loginPassword, loginPasswordAttrs] = defineLoginField('password')
const loginError = ref<string | null>(null)

const onLogin = handleLogin(async (values) => {
  loginError.value = null
  try {
    const { token, user } = await accountService.login(values.email, values.password)
    auth.setAuth(token, user)
    const redirectTo = ui.authModal.redirectTo
    close()
    if (redirectTo?.startsWith('/')) await router.push(redirectTo)
  } catch {
    loginError.value = 'E-mailadres of wachtwoord klopt niet. Probeer het opnieuw.'
  }
})

// ─── Register ───────────────────────────────────────────
const {
  handleSubmit: handleRegister,
  defineField: defineRegField,
  errors: regErrors,
  isSubmitting: regSubmitting,
  resetForm: resetRegForm,
} = useForm({
  validationSchema: toTypedSchema(z.object({
    naam: z.string({ required_error: 'Vul je naam in' }).min(2, 'Vul je naam in'),
    email: z.string({ required_error: 'Vul je e-mailadres in' }).email('Vul een geldig e-mailadres in'),
    telefoon: z.string({ required_error: 'Vul je telefoonnummer in' }).min(6, 'Vul je telefoonnummer in'),
    bericht: z.string().optional(),
    honeypot: z.string().max(0).optional(),
  })),
})

const [regNaam, regNaamAttrs] = defineRegField('naam')
const [regEmail, regEmailAttrs] = defineRegField('email')
const [regTelefoon, regTelefoonAttrs] = defineRegField('telefoon')
const [regBericht, regBerichtAttrs] = defineRegField('bericht')
const [regHoneypot] = defineRegField('honeypot')

const onRegister = handleRegister(async (values) => {
  await accountService.register({
    name: values.naam,
    email: values.email,
    phone: values.telefoon,
    message: values.bericht,
  })
  resetRegForm()
  registerSubmitted.value = true
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="fixed inset-0 m-0 h-full w-full max-w-none bg-transparent p-4 flex items-center justify-center backdrop:bg-black/60 [&:not([open])]:hidden"
    @cancel.prevent="close"
    @click.self="close"
  >
    <div class="w-full max-w-md rounded-2xl bg-white dark:bg-dark shadow-2xl" @click.stop>
      <div class="p-8">

        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <p class="text-accent-500 text-xs font-semibold tracking-widest uppercase mb-1">Mijn SWG</p>
            <h2 class="text-xl font-bold dark:text-white">
              {{ view === 'login' ? 'Inloggen' : 'Account aanvragen' }}
            </h2>
          </div>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shrink-0"
            aria-label="Sluiten"
            @click="close"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <!-- Login form -->
        <form v-if="view === 'login'" novalidate class="space-y-5" @submit.prevent="onLogin">
          <AlertBanner v-if="loginError" role="alert" variant="error" class="mb-2">
            {{ loginError }}
          </AlertBanner>

          <BaseFormField id="modal-email" label="E-mailadres" :error="loginErrors.email">
            <input id="modal-email" v-model="loginEmail" v-bind="loginEmailAttrs" type="email" autocomplete="email" :class="inputClass(!!loginErrors.email)" />
          </BaseFormField>

          <BaseFormField id="modal-password" label="Wachtwoord" :error="loginErrors.password">
            <input id="modal-password" v-model="loginPassword" v-bind="loginPasswordAttrs" type="password" autocomplete="current-password" :class="inputClass(!!loginErrors.password)" />
          </BaseFormField>

          <div class="text-sm">
            <RouterLink to="/account/wachtwoord-vergeten" class="text-primary-500 hover:underline" @click="close">
              Wachtwoord vergeten?
            </RouterLink>
          </div>

          <BaseButton type="submit" :disabled="loginSubmitting" class="w-full justify-center">
            {{ loginSubmitting ? 'Inloggen…' : 'Inloggen →' }}
          </BaseButton>

          <p class="text-xs text-center text-muted/60">Demo: test@swg-nederland.nl / test1234</p>
        </form>

        <!-- Register form -->
        <template v-else>
          <!-- Success -->
          <div v-if="registerSubmitted" role="status" aria-live="polite" class="text-center space-y-4">
            <svg class="w-12 h-12 text-success mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-base font-semibold dark:text-white">Aanvraag ontvangen!</p>
            <p class="text-sm text-muted">We sturen je een e-mail zodra je account is aangemaakt. Dit duurt doorgaans 1–2 werkdagen.</p>
            <BaseButton variant="secondary" class="w-full justify-center" @click="close">Sluiten</BaseButton>
          </div>

          <!-- Form -->
          <form v-else novalidate class="space-y-4" @submit.prevent="onRegister">
            <input v-model="regHoneypot" type="text" name="website" autocomplete="off" class="sr-only" tabindex="-1" aria-hidden="true" />

            <BaseFormField id="modal-naam" label="Naam" :error="regErrors.naam" required>
              <input id="modal-naam" v-model="regNaam" v-bind="regNaamAttrs" type="text" autocomplete="name" :class="inputClass(!!regErrors.naam)" />
            </BaseFormField>

            <BaseFormField id="modal-reg-email" label="E-mailadres" :error="regErrors.email" required>
              <input id="modal-reg-email" v-model="regEmail" v-bind="regEmailAttrs" type="email" autocomplete="email" :class="inputClass(!!regErrors.email)" />
            </BaseFormField>

            <BaseFormField id="modal-telefoon" label="Telefoonnummer" :error="regErrors.telefoon" required>
              <input id="modal-telefoon" v-model="regTelefoon" v-bind="regTelefoonAttrs" type="tel" autocomplete="tel" :class="inputClass(!!regErrors.telefoon)" />
            </BaseFormField>

            <BaseFormField id="modal-bericht" label="Toelichting" optional>
              <textarea
                id="modal-bericht"
                v-model="regBericht"
                v-bind="regBerichtAttrs"
                rows="2"
                placeholder="Bijv.: ik ben deelnemer en wil mijn aanmeldingen inzien."
                :class="[inputClass(false), 'resize-none']"
              />
            </BaseFormField>

            <BaseButton type="submit" :disabled="regSubmitting" class="w-full justify-center">
              {{ regSubmitting ? 'Versturen…' : 'Account aanvragen →' }}
            </BaseButton>
          </form>
        </template>

        <!-- Footer toggle -->
        <p v-if="!registerSubmitted" class="mt-5 text-center text-sm text-muted">
          <template v-if="view === 'login'">
            Nog geen account?
            <button type="button" class="text-primary-500 hover:underline" @click="view = 'register'">Account aanvragen</button>
          </template>
          <template v-else>
            Heb je al een account?
            <button type="button" class="text-primary-500 hover:underline" @click="view = 'login'">Inloggen</button>
          </template>
        </p>

      </div>
    </div>
  </dialog>
</template>
