import { useEffect } from "react";

// iOS Safari doesn't resize the layout when the keyboard opens,
// so expose the visual viewport size as CSS vars
export function useVisualViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const root = document.documentElement;
    let frame = 0;

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--app-height", `${viewport.height}px`);
        root.style.setProperty("--vv-offset-top", `${viewport.offsetTop}px`);
      });
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      root.style.removeProperty("--app-height");
      root.style.removeProperty("--vv-offset-top");
    };
  }, []);
}
