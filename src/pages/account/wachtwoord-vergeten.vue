<script setup lang="ts">
import { accountService } from '@/features/account/account.service'
import { pageService } from '@/shared/services/page.service'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const ui = useUiStore()

const { data: page } = useQuery({
  queryKey: ['pages', 'wachtwoord-vergeten'],
  queryFn: () => pageService.getBySlug('wachtwoord-vergeten'),
  staleTime: 30 * 60 * 1000,
})

useHead(computed(() => ({
  title: page.value?.title.rendered ?? 'Wachtwoord vergeten',
})))

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Vul een geldig e-mailadres in'),
  }),
)

const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')

const submitted = ref(false)

const onSubmit = handleSubmit(async (values) => {
  await accountService.resetPassword(values.email)
  resetForm()
  submitted.value = true
})
</script>

<template>
  <PageHero
    :eyebrow="page?.acf?.hero_eyebrow ?? 'Mijn SWG'"
    :title="page?.title.rendered ?? 'Wachtwoord vergeten'"
    :description="page?.acf?.hero_description"
  />

  <div class="container mx-auto px-4 py-12 max-w-md">
    <!-- Success -->
    <div v-if="submitted" role="status" aria-live="polite" class="rounded-2xl bg-success/10 border border-success/20 p-8 text-center">
      <svg class="w-12 h-12 text-success mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h2 class="text-xl font-semibold mb-2">E-mail verstuurd!</h2>
      <p class="text-muted">Als je e-mailadres bij ons bekend is, ontvang je een link om je wachtwoord opnieuw in te stellen.</p>
      <BaseButton variant="secondary" class="mt-6" @click="ui.openAuthModal({ view: 'login' })">Terug naar inloggen</BaseButton>
    </div>

    <!-- Form -->
    <div v-else class="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-8">
      <form novalidate class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block text-sm font-medium mb-1">E-mailadres</label>
          <input
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            autocomplete="email"
            :class="['w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/20']"
          />
          <p v-if="errors.email" role="alert" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <BaseButton type="submit" :disabled="isSubmitting" class="w-full justify-center">
          {{ isSubmitting ? 'Versturen…' : 'Reset-link versturen →' }}
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-muted">
        <button class="text-primary-500 hover:underline" @click="ui.openAuthModal({ view: 'login' })">← Terug naar inloggen</button>
      </p>
    </div>
  </div>
</template>
