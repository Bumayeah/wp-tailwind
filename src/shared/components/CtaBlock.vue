<script setup lang="ts">
defineProps<{
  variant?: 'triple' | 'simple'
  heading?: string
  body?: string
  actions?: { label: string; to: string; variant?: string }[]
}>()
</script>

<template>
  <!-- Triple CTA: three columns -->
  <section v-if="variant === 'triple' || !variant" class="bg-primary-800 text-white py-16 md:py-20" aria-labelledby="cta-heading">
    <div class="container mx-auto px-4">
      <h2 id="cta-heading" class="text-2xl md:text-3xl font-bold text-center mb-10">
        {{ heading ?? 'Doe mee met SWG Nederland' }}
      </h2>
      <div class="grid gap-6 sm:grid-cols-3">
        <div class="bg-white/10 rounded-2xl p-6 text-center space-y-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg">Donateur worden</h3>
          <p class="text-white/80 text-sm">Steun SWG met een eenmalige of jaarlijkse donatie.</p>
          <BaseButton to="/steunen#donatie" variant="ghost" class="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
            Doneer nu →
          </BaseButton>
        </div>

        <div class="bg-white/10 rounded-2xl p-6 text-center space-y-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg">Sponsor worden</h3>
          <p class="text-white/80 text-sm">Verbind uw naam aan een bijzondere stichting.</p>
          <BaseButton to="/steunen#sponsoren" variant="ghost" class="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
            Meer info →
          </BaseButton>
        </div>

        <div class="bg-white/10 rounded-2xl p-6 text-center space-y-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg">Vrijwilliger worden</h3>
          <p class="text-white/80 text-sm">Help mee op de piste of achter de schermen.</p>
          <BaseButton to="/contact" variant="ghost" class="w-full justify-center border border-white/30 hover:bg-white/10 text-white">
            Aanmelden →
          </BaseButton>
        </div>
      </div>
    </div>
  </section>

  <!-- Simple CTA -->
  <section v-else class="bg-primary-800 text-white py-16" aria-labelledby="cta-heading-simple">
    <div class="container mx-auto px-4 text-center">
      <h2 id="cta-heading-simple" class="text-2xl md:text-3xl font-bold mb-4">{{ heading }}</h2>
      <p v-if="body" class="text-white/80 text-lg mb-8 max-w-xl mx-auto">{{ body }}</p>
      <div class="flex flex-wrap gap-3 justify-center">
        <BaseButton
          v-for="action in actions"
          :key="action.to"
          :to="action.to"
          :variant="action.variant === 'outline' ? 'ghost' : 'secondary'"
          :class="action.variant === 'outline' ? 'border border-white/30 hover:bg-white/10 text-white' : ''"
        >
          {{ action.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
