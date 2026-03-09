<script setup lang="ts">
import { userService } from '@/features/user/user.service'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useHead({ title: 'Mijn profiel' })

const auth = useAuthStore()
const queryClient = useQueryClient()

const { data: profile, isPending } = useQuery({
  queryKey: ['mijn', 'profile'],
  queryFn: userService.getProfile,
})

const schema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'Vul je naam in'),
    email: z.string().email('Vul een geldig e-mailadres in'),
    phone: z.string().min(6, 'Vul je telefoonnummer in'),
  }),
)

const { handleSubmit, defineField, errors, isSubmitting, setValues } = useForm({ validationSchema: schema })

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')

watch(profile, (p) => {
  if (p) setValues({ name: p.name, email: p.email, phone: p.phone })
}, { immediate: true })

const saved = ref(false)
const inputClass = useInputClass()

const onSubmit = handleSubmit(async (values) => {
  if (!profile.value) return
  const updated = await userService.updateProfile(profile.value.id, {
    name: values.name,
    email: values.email,
    phone: values.phone,
  })
  auth.setAuth(auth.token!, { ...auth.user!, name: updated.name, email: updated.email, phone: updated.phone })
  queryClient.invalidateQueries({ queryKey: ['mijn', 'profile'] })
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
})
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-6 dark:text-white">Mijn profiel</h2>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton class="h-10 w-full rounded-lg" />
      <BaseSkeleton class="h-10 w-full rounded-lg" />
      <BaseSkeleton class="h-10 w-full rounded-lg" />
    </div>

    <!-- Form -->
    <BaseCard v-else variant="elevated" padding="lg" class="max-w-lg">
      <!-- Saved confirmation -->
      <AlertBanner v-if="saved" variant="success" size="sm" role="status" aria-live="polite" class="mb-6">
        <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
        Profiel opgeslagen.
      </AlertBanner>

      <form novalidate class="space-y-5" @submit.prevent="onSubmit">
        <BaseFormField id="name" label="Naam" :error="errors.name">
          <input id="name" v-model="name" v-bind="nameAttrs" type="text" autocomplete="name" :class="inputClass(!!errors.name)" />
        </BaseFormField>

        <BaseFormField id="email" label="E-mailadres" :error="errors.email">
          <input id="email" v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" :class="inputClass(!!errors.email)" />
        </BaseFormField>

        <BaseFormField id="phone" label="Telefoonnummer" :error="errors.phone">
          <input id="phone" v-model="phone" v-bind="phoneAttrs" type="tel" autocomplete="tel" :class="inputClass(!!errors.phone)" />
        </BaseFormField>

        <BaseButton type="submit" :disabled="isSubmitting" class="w-full justify-center">
          {{ isSubmitting ? 'Opslaan…' : 'Opslaan' }}
        </BaseButton>
      </form>
    </BaseCard>
  </div>
</template>
