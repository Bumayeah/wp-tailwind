<script setup lang="ts">
const year = new Date().getFullYear()
const logoUrl = `${import.meta.env.BASE_URL}logo-w.png`
</script>

<template>
  <footer role="contentinfo" class="bg-dark pt-12 pb-6 text-white">
    <div class="container mx-auto grid gap-10 px-4 md:grid-cols-3">
      <!-- Column 1: Logo + social -->
      <div class="flex flex-col gap-5">
        <RouterLink to="/" aria-label="SWG Nederland — home">
          <img :src="logoUrl" alt="SWG Nederland" class="h-10 w-auto" />
        </RouterLink>
        <p class="text-sm leading-relaxed text-white/60">
          Stichting Wintersport Gehandicapten Nederland maakt skiën mogelijk voor mensen met een
          beperking.
        </p>
        <div class="flex gap-3">
          <a
            href="https://facebook.com/swgnederland"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SWG Nederland op Facebook"
            class="text-white/60 transition-colors hover:text-white"
          >
            <IconFacebook class="h-6 w-6" />
          </a>
          <a
            href="https://instagram.com/swgnederland"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SWG Nederland op Instagram"
            class="text-white/60 transition-colors hover:text-white"
          >
            <IconInstagram class="h-6 w-6" />
          </a>
        </div>
      </div>

      <!-- Column 2: Navigation -->
      <nav aria-label="Footer navigation">
        <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/70">
          <li><RouterLink to="/" class="transition-colors hover:text-white">Home</RouterLink></li>
          <li>
            <RouterLink to="/agenda" class="transition-colors hover:text-white">Reizen</RouterLink>
          </li>
          <li>
            <RouterLink to="/nieuws" class="transition-colors hover:text-white">Nieuws</RouterLink>
          </li>
          <li>
            <RouterLink to="/over-ons" class="transition-colors hover:text-white"
              >Over ons</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/veelgesteldevragen" class="transition-colors hover:text-white"
              >FAQ</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/contact" class="transition-colors hover:text-white"
              >Contact</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/steunen" class="transition-colors hover:text-white"
              >Steunen</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/algemeenbestuur" class="transition-colors hover:text-white"
              >Bestuur</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/privacy" class="transition-colors hover:text-white"
              >Privacy</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/cookies" class="transition-colors hover:text-white"
              >Cookies</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/algemene-voorwaarden" class="transition-colors hover:text-white"
              >Voorwaarden</RouterLink
            >
          </li>
        </ul>
      </nav>

      <!-- Column 3: Organisation details -->
      <address class="flex flex-col gap-1.5 text-sm text-white/60 not-italic">
        <strong class="font-semibold text-white"
          >Stichting Wintersport Gehandicapten Nederland</strong
        >
        <span>KvK: [nummer]</span>
        <span>IBAN: [rekeningnummer]</span>
        <span>BIC: [BIC code]</span>
        <span class="mt-2 leading-snug">[postadres]</span>
        <a href="mailto:info@swg-nederland.nl" class="transition-colors hover:text-white">
          info@swg-nederland.nl
        </a>
      </address>
    </div>

    <!-- Copyright bar -->
    <div
      class="container mx-auto mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 px-4 pt-4 text-xs text-white/40 sm:flex-row"
    >
      <span>© {{ year }} SWG Nederland — Stichting Wintersport Gehandicapten Nederland</span>
      <div class="flex gap-4">
        <RouterLink to="/privacy" class="transition-colors hover:text-white/70"
          >Privacybeleid</RouterLink
        >
        <RouterLink to="/cookies" class="transition-colors hover:text-white/70"
          >Cookiebeleid</RouterLink
        >
        <RouterLink to="/algemene-voorwaarden" class="transition-colors hover:text-white/70"
          >Voorwaarden</RouterLink
        >
      </div>
    </div>
  </footer>
</template>
