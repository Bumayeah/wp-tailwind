<script setup lang="ts">
import { pageService } from '@/shared/services/page.service'
import { apiPost } from '@/shared/services/api'
import FaqAccordion from '@/shared/components/ui/FaqAccordion.vue'
import CtaBlock from '@/shared/components/CtaBlock.vue'
import p1 from '@/assets/swg-05.jpg'
import p2 from '@/assets/swg-11.jpg'
import p3 from '@/assets/swg-17.jpg'
import p4 from '@/assets/swg-25.jpg'
import p5 from '@/assets/swg-30.jpg'

const galleryPhotos = [
  { src: p1, alt: '' },
  { src: p2, alt: '' },
  { src: p3, alt: '' },
  { src: p4, alt: '' },
  { src: p5, alt: '' },
]

const { data: faqPage } = useQuery({
  queryKey: ['pages', 'faq'],
  queryFn: () => pageService.getBySlug('faq'),
  staleTime: 10 * 60 * 1000,
})

const acf = computed(() => faqPage.value?.acf as Record<string, any> | undefined)
const faqItems = computed<{ question: string; answer: string }[]>(() => acf.value?.faq_items ?? [])

useHead(
  computed(() => ({
    title: `${faqPage.value?.title.rendered ?? 'Veelgestelde vragen'}`,
    meta: [{ name: 'description', content: faqPage.value?.acf?.hero_description ?? '' }],
    script: faqItems.value.length
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.value.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          },
        ]
      : [],
  })),
)

const auth = useAuthStore()
const ui = useUiStore()
const queryClient = useQueryClient()
const questionText = ref('')
const lastQuestion = ref('')
const submitted = ref(false)
const isSubmitting = ref(false)

async function submitQuestion() {
  if (!questionText.value.trim()) return
  isSubmitting.value = true
  try {
    await apiPost('/swg/v1/mijn/vragen', {
      question: questionText.value,
      status: 'pending',
      user_id: auth.user?.id,
      created_at: new Date().toISOString(),
    })
    lastQuestion.value = questionText.value
    questionText.value = ''
    submitted.value = true
    queryClient.invalidateQueries({ queryKey: ['mijn', 'questions'] })
  } finally {
    isSubmitting.value = false
  }
}

function newQuestion() {
  submitted.value = false
  lastQuestion.value = ''
}
</script>

<template>
  <PageHero
    :eyebrow="faqPage?.acf?.hero_eyebrow ?? 'FAQ'"
    :title="faqPage?.title?.rendered ?? 'Veelgestelde vragen'"
    :description="faqPage?.acf?.hero_description"
  />

  <AppSection tag="div">
    <SidebarLayout>

      <!-- Left: FAQ + question form -->
      <div>
        <!-- FAQ skeleton -->
        <div v-if="!faqPage" class="space-y-3">
          <BaseSkeleton v-for="n in 5" :key="n" class="h-14" />
        </div>

        <!-- FAQ accordion -->
        <FaqAccordion v-else-if="faqItems.length" :items="faqItems" />

        <EmptyState
          v-else
          title="Geen vragen gevonden"
          description="Er zijn momenteel geen veelgestelde vragen. Neem contact met ons op."
        />

        <!-- Question panel -->
        <section
          class="mt-12 rounded-2xl border border-gray-200 p-6 dark:border-white/10"
          aria-labelledby="faq-question-heading"
        >
      <h2 id="faq-question-heading" class="mb-4 text-xl font-semibold dark:text-white">
        Staat jouw vraag er niet bij?
      </h2>

      <!-- Logged in + submitted -->
      <div v-if="auth.isLoggedIn && submitted" role="status" aria-live="polite" class="space-y-4">
        <div class="bg-success/10 border-success/20 flex items-start gap-3 rounded-xl border p-4">
          <svg
            class="text-success mt-0.5 h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="text-success mb-1 text-sm font-semibold">Vraag verstuurd!</p>
            <p class="text-muted text-sm">{{ lastQuestion }}</p>
          </div>
        </div>
        <BaseButton variant="secondary" size="sm" @click="newQuestion">
          Nog een vraag stellen
        </BaseButton>
      </div>

      <!-- Logged in + form -->
      <form v-else-if="auth.isLoggedIn" novalidate @submit.prevent>
        <label for="question-input" class="mb-1 block text-sm font-medium dark:text-white">Jouw vraag</label>
        <textarea
          id="question-input"
          v-model="questionText"
          rows="4"
          :disabled="isSubmitting"
          placeholder="Stel hier je vraag..."
          class="dark:bg-dark focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-white/20"
        />
        <BaseButton
          type="button"
          :disabled="isSubmitting || !questionText.trim()"
          class="mt-3"
          @click="submitQuestion"
        >
          {{ isSubmitting ? 'Versturen…' : 'Vraag insturen' }}
        </BaseButton>
      </form>

      <!-- Not logged in -->
      <div v-else-if="!auth.isLoggedIn">
        <p class="text-muted mb-4">Wil je een vraag stellen? Maak een account aan of log in.</p>
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="ui.openAuthModal({ view: 'login', redirectTo: '/veelgesteldevragen' })">
            Inloggen →
          </BaseButton>
          <BaseButton variant="secondary" @click="ui.openAuthModal({ view: 'register' })">
            Account aanvragen
          </BaseButton>
        </div>
        </div>
      </section>
      </div>

      <template #sidebar>
        <div class="hidden lg:block">
          <PhotoGrid :photos="galleryPhotos" variant="sidebar" />
        </div>
      </template>

    </SidebarLayout>
  </AppSection>

  <CtaBlock heading="Doe mee met SWG Nederland" />
</template>
