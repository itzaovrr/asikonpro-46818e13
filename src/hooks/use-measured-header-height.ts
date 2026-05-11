import { useEffect, RefObject } from "react";

/**
 * Measures the live offsetHeight of a header element (including its own
 * safe-area-inset padding) and publishes it as the global CSS variable
 * `--app-header-h` on <html>. This becomes the single source of truth for
 * every sticky offset in the app (sticky tab bars, main content padding, etc.)
 * and stays accurate across:
 *   - device rotation
 *   - dynamic browser chrome (mobile URL bar)
 *   - safe-area changes (notch / status-bar variations)
 *   - layout/font changes that affect header height
 */
export function useMeasuredHeaderHeight(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty("--app-header-h", `${h}px`);
      }
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("orientationchange", apply);
    window.addEventListener("resize", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", apply);
      window.removeEventListener("resize", apply);
    };
  }, [ref]);
}
