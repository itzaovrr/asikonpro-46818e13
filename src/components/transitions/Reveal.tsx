import { useEffect, useRef, useState, type ReactNode, type ElementType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  variant?: "fade-up" | "fade" | "scale";
  once?: boolean;
}

/** Shared IntersectionObserver — one per page instead of one per Reveal. */
type Cb = (visible: boolean) => void;
const callbacks = new WeakMap<Element, Cb>();
let sharedIO: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === "undefined") return null;
  if (sharedIO) return sharedIO;
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const cb = callbacks.get(entry.target);
        if (cb) cb(entry.isIntersecting);
      }
    },
    { threshold: 0.01, rootMargin: "200px 0px 400px 0px" },
  );
  return sharedIO;
}

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
    const io = getObserver();
    if (!io) {
      setShown(true);
      return;
    }
    // Safety fallback: if IO never fires within 800ms (e.g. far below viewport
    // during full-page renders), reveal anyway so layout is never left blank.
    const fallback = window.setTimeout(() => setShown(true), 800);
    callbacks.set(el, (visible) => {
      if (visible) {
        setShown(true);
        window.clearTimeout(fallback);
        if (once) {
          io.unobserve(el);
          callbacks.delete(el);
        }
      } else if (!once) {
        setShown(false);
      }
    });
    io.observe(el);
    return () => {
      window.clearTimeout(fallback);
      io.unobserve(el);
      callbacks.delete(el);
    };
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
