<script setup lang="ts">
// Dynamic binding bypasses Vite's asset URL transformation for public/ assets
const logoUrl = `${import.meta.env.BASE_URL}logo-w.png`

const isMenuOpen = ref(false)
const scrolled = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const route = useRoute()

// Close menu on route change
watch(() => route.path, () => {
  isMenuOpen.value = false
})

// Scroll lock when menu is open
const bodyScrollLock = useScrollLock(typeof document !== 'undefined' ? document.body : null)
watch(isMenuOpen, (open) => {
  bodyScrollLock.value = open
})

// Track scroll for backdrop blur
// Track scroll for shadow
useEventListener('scroll', () => { scrolled.value = window.scrollY > 20 }, { passive: true })

// Close on Escape
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) isMenuOpen.value = false
})

const ui = useUiStore()

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/agenda', label: 'Reizen' },
  { to: '/nieuws', label: 'Nieuws' },
  { to: '/over-ons', label: 'Over ons' },
  { to: '/veelgesteldevragen', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-40 bg-dark transition-shadow duration-300',
      scrolled ? 'shadow-lg shadow-black/30' : '',
    ]"
  >
    <TheTopBar />

    <!-- Divider between topbar and navbar -->
    <div class="border-b border-white/10" />

    <!-- Navbar -->
    <div class="container mx-auto flex items-center justify-between px-4 h-16">

      <!-- Logo -->
      <RouterLink to="/" aria-label="SWG Nederland — home" class="shrink-0">
        <img :src="logoUrl" alt="SWG Nederland" class="h-9 w-auto" />
      </RouterLink>

      <!-- Desktop nav -->
      <nav aria-label="Main navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative py-1 hover:text-white transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 [&.router-link-active]:text-white [&.router-link-active]:after:scale-x-100"
          :exact="link.to === '/'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Desktop right: CTA + ThemeToggle -->
      <div class="hidden md:flex items-center gap-3">
        <ThemeToggle />
        <RouterLink
          to="/agenda"
          class="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors active:scale-97"
        >
          Aanmelden →
        </RouterLink>
      </div>

      <!-- Mobile: ThemeToggle + hamburger -->
      <div class="flex md:hidden items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          class="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span
            :class="['block w-6 h-0.5 bg-current transition-transform duration-300', isMenuOpen ? 'translate-y-2 rotate-45' : '']"
          />
          <span
            :class="['block w-6 h-0.5 bg-current transition-opacity duration-300', isMenuOpen ? 'opacity-0' : '']"
          />
          <span
            :class="['block w-6 h-0.5 bg-current transition-transform duration-300', isMenuOpen ? '-translate-y-2 -rotate-45' : '']"
          />
        </button>
      </div>

    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        ref="menuRef"
        class="md:hidden bg-dark-secondary border-t border-white/10"
      >
        <nav aria-label="Mobile navigation" class="container mx-auto px-4 py-4">
          <ul role="list" class="flex flex-col gap-1">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="block px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors [&.router-link-active]:text-white [&.router-link-active]:bg-white/10 font-medium"
                :exact="link.to === '/'"
                @click="isMenuOpen = false"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>

          <div class="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              class="block w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
              @click="isMenuOpen = false; ui.openAuthModal({ view: 'login' })"
            >
              Inloggen
            </button>
            <RouterLink
              to="/agenda"
              class="block text-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
              @click="isMenuOpen = false"
            >
              Aanmelden →
            </RouterLink>
          </div>
        </nav>
      </div>
    </Transition>

  </header>

  <!-- Backdrop overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMenuOpen"
      class="md:hidden fixed inset-0 z-30 bg-black/50"
      aria-hidden="true"
      @click="isMenuOpen = false"
    />
  </Transition>
</template>
