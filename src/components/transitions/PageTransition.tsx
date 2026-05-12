import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Lightweight, non-blocking page transition.
 *
 * The previous implementation introduced a 150ms blank-screen delay on every
 * route change (state-based double-render with `setTimeout`). That hurt
 * perceived performance more than it helped polish.
 *
 * This version mounts children synchronously and triggers a one-frame
 * CSS fade-in via a class swap. No JS animation, no layout thrash, no
 * blocking timeout — feels instant on mobile.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-enter-active");
    // force reflow so the transition replays
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void el.offsetWidth;
    el.classList.add("page-enter-active");
  });

  return (
    // NOTE: Do NOT use `transform` here — it would create a containing block
    // for any `position: fixed` descendants (desktop sidebar).
    <div ref={ref} className="page-enter page-enter-active">
      {children}
    </div>
  );
}
