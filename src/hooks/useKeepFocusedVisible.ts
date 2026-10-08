import { useEffect, type RefObject } from 'react'

const KEYBOARD_SETTLE_MS = 300
const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]'

// Scroll the focused field back into view once the keyboard is open
export function useKeepFocusedVisible(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewport = window.visualViewport
    let timer: ReturnType<typeof setTimeout> | undefined

    const reveal = () => {
      const active = document.activeElement
      if (active instanceof HTMLElement && container.contains(active) && active.matches(EDITABLE_SELECTOR)) {
        active.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }

    const scheduleReveal = () => {
      clearTimeout(timer)
      timer = setTimeout(reveal, KEYBOARD_SETTLE_MS)
    }

    container.addEventListener('focusin', scheduleReveal)
    viewport?.addEventListener('resize', scheduleReveal)
    return () => {
      clearTimeout(timer)
      container.removeEventListener('focusin', scheduleReveal)
      viewport?.removeEventListener('resize', scheduleReveal)
    }
  }, [containerRef])
}
