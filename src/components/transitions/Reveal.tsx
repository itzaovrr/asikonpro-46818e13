import { useEffect, useRef, useState, type ReactNode, type ElementType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  /** ms — staggered delay (e.g. index * 60) */
  delay?: number;
  /** Animation variant */
  variant?: "fade-up" | "fade" | "scale";
  /** Once revealed, never animate again (default true) */
  once?: boolean;
}

/**
 * Scroll-triggered reveal using IntersectionObserver. GPU-only
 * (opacity + transform), respects `prefers-reduced-motion`.
 *
 * Usage:
 *   <Reveal><Card /></Reveal>
 *   <Reveal delay={80} variant="scale">...</Reveal>
 */
export function Reveal({
  as: Tag = "div",
  children,
  delay = 0,
  variant = "fade-up",
  once = true,
  className,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const baseHidden =
    variant === "scale"
      ? "opacity-0 scale-[0.97]"
      : variant === "fade"
      ? "opacity-0"
      : "opacity-0 translate-y-3";

  const baseShown = "opacity-100 translate-y-0 scale-100";

  return (
    <Tag
      ref={ref as any}
      className={cn(
        "will-change-[opacity,transform] transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? baseShown : baseHidden,
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
