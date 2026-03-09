export function useDragScroll() {
  const trackRef = ref<HTMLElement | null>(null)
  const isDragging = ref(false)
  const startX = ref(0)
  const scrollLeft = ref(0)

  function onDragStart(e: MouseEvent) {
    isDragging.value = true
    startX.value = e.pageX - (trackRef.value?.offsetLeft ?? 0)
    scrollLeft.value = trackRef.value?.scrollLeft ?? 0
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging.value || !trackRef.value) return
    e.preventDefault()
    const x = e.pageX - trackRef.value.offsetLeft
    trackRef.value.scrollLeft = scrollLeft.value - (x - startX.value) * 1.5
  }

  function onDragEnd() {
    isDragging.value = false
  }

  return { trackRef, isDragging, onDragStart, onDragMove, onDragEnd }
}
