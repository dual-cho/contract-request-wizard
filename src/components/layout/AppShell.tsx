import { useEffect, useRef, type ReactNode } from 'react'

import { useKeepFocusedVisible } from '@/hooks/useKeepFocusedVisible'
import { useVisualViewport } from '@/hooks/useVisualViewport'

interface AppShellProps {
  header: ReactNode
  footer?: ReactNode
  /** Scroll resets to top when this changes */
  scrollKey?: string | number
  children: ReactNode
}

// Only <main> scrolls, so the footer stays above the keyboard
export function AppShell({ header, footer, scrollKey, children }: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null)
  useVisualViewport()
  useKeepFocusedVisible(mainRef)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [scrollKey])

  return (
    <div className="fixed inset-x-0 top-(--vv-offset-top,0px) flex h-(--app-height,100dvh) flex-col bg-background">
      <header className="shrink-0 border-b bg-background px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
        <div className="mx-auto w-full max-w-xl">{header}</div>
      </header>
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-py-6 px-4 py-5">
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </main>
      {footer && (
        <footer className="shrink-0 border-t bg-background px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <div className="mx-auto w-full max-w-xl">{footer}</div>
        </footer>
      )}
    </div>
  )
}
