import { useLayoutEffect, RefObject } from "react";

/**
 * Measures the live offsetHeight of a header element (including its own
 * safe-area-inset padding) and publishes it as the global CSS variable
 * `--app-header-h` on <html>. Single source of truth for sticky offsets.
 */
export function useMeasuredHeaderHeight(ref: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty("--app-header-h", `${h}px`);
      }
    };

    apply();
    const raf = requestAnimationFrame(apply);
    const t1 = window.setTimeout(apply, 50);
    const t2 = window.setTimeout(apply, 250);

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("orientationchange", apply);
    window.addEventListener("resize", apply);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("orientationchange", apply);
      window.removeEventListener("resize", apply);
      document.documentElement.style.removeProperty("--app-header-h");
    };
  }, [ref]);
}
