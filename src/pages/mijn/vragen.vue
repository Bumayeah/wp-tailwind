<script setup lang="ts">
import { userService } from '@/features/user/user.service'
import type { UserQuestion } from '@/features/user/user.service'
import { apiPost } from '@/shared/services/api'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useHead({ title: 'Mijn vragen' })

const queryClient = useQueryClient()

const { data: questions, isPending } = useQuery({
  queryKey: ['mijn', 'questions'],
  queryFn: userService.getQuestions,
})

const schema = toTypedSchema(
  z.object({ question: z.string().min(10, 'Vul een vraag in van minimaal 10 tekens') }),
)

const { handleSubmit, defineField, errors, isSubmitting, resetForm } = useForm({ validationSchema: schema })
const [question, questionAttrs] = defineField('question')

const submitted = ref(false)
const lastQuestion = ref('')

const auth = useAuthStore()

const onSubmit = handleSubmit(async (values) => {
  lastQuestion.value = values.question
  await apiPost('/swg/v1/mijn/vragen', {
    question: values.question,
    status: 'pending',
    user_id: auth.user?.id,
    created_at: new Date().toISOString(),
  })
  resetForm()
  submitted.value = true
  queryClient.invalidateQueries({ queryKey: ['mijn', 'questions'] })
})

function newQuestion() {
  submitted.value = false
  lastQuestion.value = ''
}

const deletingId = ref<number | null>(null)

async function deleteQuestion(id: number) {
  deletingId.value = id
  try {
    await userService.deleteQuestion(id)
    queryClient.setQueryData<UserQuestion[]>(['mijn', 'questions'], (old) => old?.filter(q => q.id !== id) ?? [])
  } catch (e) {
    console.error('Fout bij verwijderen vraag', e)
  } finally {
    deletingId.value = null
  }
}

const statusLabel: Record<string, string> = { pending: 'In behandeling', answered: 'Beantwoord' }
const statusClass: Record<string, string> = {
  pending: 'text-accent-500 bg-accent-500/10',
  answered: 'text-success bg-success/10',
}

const { formatDate } = useFormatting()
</script>

<template>
  <div class="space-y-8">

    <h2 class="text-xl font-semibold">Mijn vragen</h2>

    <!-- New question form -->
    <section class="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-6">
      <h3 class="text-base font-semibold mb-4">Nieuwe vraag stellen</h3>

      <!-- Success state -->
      <div v-if="submitted" role="status" aria-live="polite" class="space-y-4">
        <div class="rounded-xl bg-success/10 border border-success/20 p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-success mb-1">Vraag verstuurd!</p>
            <p class="text-sm text-muted">{{ lastQuestion }}</p>
          </div>
        </div>
        <BaseButton variant="secondary" size="sm" @click="newQuestion">
          Nog een vraag stellen
        </BaseButton>
      </div>

      <!-- Form -->
      <form v-else novalidate @submit.prevent="onSubmit">
        <div class="mb-4">
          <label for="question" class="block text-sm font-medium mb-1 dark:text-white">Jouw vraag</label>
          <textarea
            id="question"
            v-model="question"
            v-bind="questionAttrs"
            rows="3"
            :class="['w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none',
              errors.question ? 'border-red-500' : 'border-gray-300 dark:border-white/20']"
          />
          <p v-if="errors.question" role="alert" class="text-sm text-red-500 mt-1">{{ errors.question }}</p>
        </div>
        <BaseButton type="submit" :disabled="isSubmitting" size="sm">
          {{ isSubmitting ? 'Versturen…' : 'Vraag versturen →' }}
        </BaseButton>
      </form>
    </section>

    <!-- Questions list -->
    <section>
      <h3 class="text-base font-semibold mb-4">Eerder gestelde vragen</h3>

      <div v-if="isPending" class="space-y-3">
        <BaseSkeleton class="h-24 w-full rounded-xl" />
      </div>

      <p v-else-if="!questions?.length" class="text-sm text-muted">Je hebt nog geen vragen gesteld.</p>

      <ul v-else role="list" class="space-y-4">
        <li
          v-for="item in questions"
          :key="item.id"
          class="bg-white dark:bg-dark-secondary rounded-2xl shadow-sm p-5"
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <p class="text-sm font-medium dark:text-white">{{ item.question }}</p>
            <span :class="['text-xs font-semibold px-2 py-1 rounded-full shrink-0', statusClass[item.status] ?? 'text-muted bg-muted/10']">
              {{ statusLabel[item.status] ?? item.status }}
            </span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <p class="text-xs text-muted">Gesteld op {{ item.created_at ? formatDate(item.created_at) : '—' }}</p>
            <button
              v-if="item.status === 'pending'"
              type="button"
              :disabled="deletingId === item.id"
              class="text-xs text-red-500 hover:underline disabled:opacity-50"
              @click="deleteQuestion(item.id)"
            >
              {{ deletingId === item.id ? 'Verwijderen…' : 'Verwijderen' }}
            </button>
          </div>
          <div v-if="item.answer" class="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
            <p class="text-xs font-semibold text-success mb-1">Antwoord van SWG:</p>
            <p class="text-sm text-muted">{{ item.answer }}</p>
          </div>
        </li>
      </ul>
    </section>

  </div>
</template>
