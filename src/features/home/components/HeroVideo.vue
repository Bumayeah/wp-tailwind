<script setup lang="ts">
defineProps<{
  tagline: string
  headline: string
  description: string
}>()

const VIDEO_ID = '2tud7LC41c8'
const START_TIME = 12

const playerRef = ref<HTMLDivElement | null>(null)

const prefersReducedMotion = usePreferredReducedMotion()
const shouldAutoPlay = computed(() => prefersReducedMotion.value === 'no-preference')

onMounted(() => {
  if (!shouldAutoPlay.value) return

  if (!document.getElementById('yt-api-script')) {
    const tag = document.createElement('script')
    tag.id = 'yt-api-script'
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }

  function createPlayer() {
    if (!playerRef.value) return
    new (window as any).YT.Player(playerRef.value, {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        start: START_TIME,
      },
      events: {
        onStateChange(event: any) {
          if (event.data === 0) {
            event.target.seekTo(START_TIME)
            event.target.playVideo()
          }
        },
      },
    })
  }

  if ((window as any).YT?.Player) {
    createPlayer()
  } else {
    const prev = (window as any).onYouTubeIframeAPIReady
    ;(window as any).onYouTubeIframeAPIReady = () => {
      prev?.()
      createPlayer()
    }
  }
})
</script>

<template>
  <section
    class="relative bg-dark overflow-hidden"
    aria-label="Hero"
  >
    <!-- Background glow decorations -->
    <div class="pointer-events-none absolute -top-40 -left-40 w-150 h-150 rounded-full bg-primary-500/10 blur-3xl z-10" aria-hidden="true" />
    <div class="pointer-events-none absolute -bottom-20 right-0 w-100 h-100 rounded-full bg-accent-500/8 blur-3xl z-10" aria-hidden="true" />

    <!-- Full-width video wrapper — no container, no rounding -->
    <div class="relative min-h-96 md:aspect-video bg-dark-secondary">

      <!-- YouTube player -->
      <div
        v-if="shouldAutoPlay"
        ref="playerRef"
        class="absolute inset-0 w-full h-full scale-105 pointer-events-none [&>iframe]:w-full [&>iframe]:h-full"
        aria-hidden="true"
      />

      <!-- Fallback gradient (reduced-motion) -->
      <div
        v-else
        class="absolute inset-0 bg-linear-to-br from-primary-900 via-dark to-dark-secondary"
        aria-hidden="true"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-16 h-16 text-white/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <!-- Dark gradient — left to right so text stays readable -->
      <div
        class="absolute inset-0 bg-linear-to-r from-dark/85 via-dark/50 to-dark/10"
        aria-hidden="true"
      />

      <!-- Text content — inside container for alignment -->
      <div class="absolute inset-0 z-10 flex items-center">
        <div class="container mx-auto px-4 pb-20 md:pb-24">
          <p class="text-accent-500 font-semibold text-xs md:text-sm uppercase tracking-widest mb-3 md:mb-4">
            {{ tagline }}
          </p>
          <h1 class="text-2xl md:text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4 md:mb-6">
            {{ headline }}
          </h1>
          <p class="hidden md:block text-lg text-white/75 leading-relaxed mb-10 max-w-md">
            {{ description }}
          </p>
          <div class="flex flex-wrap gap-2 md:gap-3">
            <BaseButton to="/agenda">
              Bekijk reizen →
            </BaseButton>
            <BaseButton to="/over-ons" class="bg-white/10! hover:bg-white/15! text-white! border! border-white/20!">
              Over ons
            </BaseButton>
          </div>
        </div>
      </div>

<!-- SVG concave arch divider — smooth transition to dark-secondary -->
      <div class="absolute bottom-0 left-0 right-0 leading-none z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          class="w-full h-20 md:h-24 lg:h-28"
        >
          <path d="M0,100 L0,70 Q720,0 1440,70 L1440,100 Z" fill="#2d2c3e" />
        </svg>
      </div>

    </div>
  </section>
</template>
