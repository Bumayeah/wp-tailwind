<script setup lang="ts">
const route = useRoute()
const status = computed(() => route.query.status as string | undefined)
const naam = computed(() => route.query.naam ? decodeURIComponent(route.query.naam as string) : null)
const amount = computed(() => route.query.amount ? Number(route.query.amount) : null)
const isMock = computed(() => route.query.mock === 'true')

const { formatCurrency } = useFormatting()

useHead(computed(() => ({
  title: status.value === 'paid'
    ? 'Bedankt voor je donatie'
    : 'Betaling niet geslaagd',
})))
</script>

<template>
  <div class="container mx-auto px-4 py-20 max-w-2xl text-center">

    <!-- Paid -->
    <template v-if="status === 'paid'">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-8">
        <svg class="w-10 h-10 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        Hartelijk bedankt{{ naam ? `, ${naam}` : '' }}!
      </h1>
      <p class="text-muted text-lg mb-4">
        <template v-if="amount">
          Je donatie van <strong>{{ formatCurrency(amount) }}</strong> is ontvangen.
        </template>
        <template v-else>
          Je donatie is ontvangen.
        </template>
        Je ontvangt een bevestiging per e-mail.
      </p>
      <p class="text-muted mb-8">
        Met jouw steun maken wij het mogelijk dat mensen met een beperking kunnen genieten van de wintersport. Dank je wel!
      </p>

      <p v-if="isMock" class="text-xs text-muted mb-6 bg-gray-100 dark:bg-white/5 rounded-lg px-4 py-2">
        Dit is een simulatie — er is geen echte betaling verwerkt.
      </p>

      <div class="flex flex-wrap gap-3 justify-center">
        <BaseButton to="/">Terug naar home</BaseButton>
        <BaseButton to="/agenda" variant="secondary">Bekijk reizen</BaseButton>
      </div>
    </template>

    <!-- Failed or cancelled -->
    <template v-else>
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-8">
        <svg class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        {{ status === 'cancelled' ? 'Betaling geannuleerd' : 'Betaling mislukt' }}
      </h1>
      <p class="text-muted text-lg mb-8">
        {{ status === 'cancelled'
          ? 'Je hebt de betaling geannuleerd. Je kunt het opnieuw proberen.'
          : 'Er is iets misgegaan bij de betaling. Probeer het opnieuw of neem contact met ons op.' }}
      </p>

      <div class="flex flex-wrap gap-3 justify-center">
        <BaseButton to="/steunen#donatie">Opnieuw proberen</BaseButton>
        <BaseButton to="/contact" variant="secondary">Contact opnemen</BaseButton>
      </div>
    </template>

  </div>
</template>
