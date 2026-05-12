import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Premium page transition: instant mount with a one-frame fade + subtle
 * upward slide. GPU-only (opacity/transform). No JS timers, no blank flash.
 *
 * IMPORTANT: We deliberately scope the transform to a *child* of the route
 * outlet so any `position: fixed` descendants (desktop sidebar, bottom nav)
 * are NOT contained by it.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-enter-active");
    // force reflow so the transition replays on every route change
    void el.offsetWidth;
    el.classList.add("page-enter-active");
  });

  return (
    <div ref={ref} className="page-enter page-enter-active">
      {children}
    </div>
  );
}
