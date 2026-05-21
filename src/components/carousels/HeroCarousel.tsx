import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplayDelay?: number;
  className?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function HeroCarousel({ slides, autoplayDelay = 5000, className }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const autoplayActive = !isPaused && !docHidden && !reducedMotion;

  useEffect(() => {
    if (!emblaApi || !autoplayActive) return;
    const interval = setInterval(() => emblaApi.scrollNext(), autoplayDelay);
    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay, autoplayActive]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      className={cn(
        "relative group/hero overflow-hidden rounded-3xl",
        "border border-primary/15",
        "shadow-[0_12px_40px_-18px_hsl(var(--primary)/0.35)]",
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Brand gradient border accent */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 mix-blend-overlay"
        style={{ background: "var(--gradient-primary)", mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: 1 } as any}
        aria-hidden
      />

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/8] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={cn(
                      "w-full h-full object-cover will-change-transform",
                      !reducedMotion && isActive && autoplayActive
                        ? "scale-110 transition-transform duration-[6000ms] ease-out"
                        : "scale-100 transition-transform duration-700",
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    // @ts-expect-error fetchpriority valid HTML
                    fetchpriority={index === 0 ? "high" : "low"}
                  />
                  {/* Background-tinted scrim for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                  {/* Brand warmth wash from bottom-left */}
                  <div
                    className="absolute inset-0 opacity-50 mix-blend-soft-light"
                    style={{ background: "radial-gradient(120% 90% at 0% 100%, hsl(var(--primary) / 0.55), transparent 60%)" }}
                    aria-hidden
                  />

                  {/* Text block */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 md:p-6 pb-6 sm:pb-7">
                    <div
                      key={`text-${selectedIndex}-${slide.id}`}
                      className={cn("max-w-md", isActive && "animate-fade-in")}
                    >
                      {(slide.eyebrow ?? `Slide ${index + 1}`) && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] bg-background/60 backdrop-blur-md border border-primary/25 text-foreground">
                          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                          {slide.eyebrow ?? `Slide ${index + 1}`}
                        </span>
                      )}
                      <h2 className="font-display font-bold text-lg sm:text-2xl md:text-3xl leading-tight tracking-tight text-foreground">
                        <span className="text-gradient">{slide.title.split(" ").slice(0, 2).join(" ")}</span>
                        {slide.title.split(" ").length > 2 && (
                          <> {slide.title.split(" ").slice(2).join(" ")}</>
                        )}
                      </h2>
                      {slide.subtitle && (
                        <p className="mt-1.5 text-xs sm:text-sm text-foreground/80 line-clamp-2">
                          {slide.subtitle}
                        </p>
                      )}
                      <div className="mt-3 sm:mt-4 flex items-center gap-2">
                        {slide.cta && (
                          <Link
                            to={slide.cta.href}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-semibold shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_10px_28px_-6px_hsl(var(--primary)/0.7)] active:scale-95 transition-all"
                          >
                            {slide.cta.label}
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        )}
                        {slide.secondaryCta && (
                          <Link
                            to={slide.secondaryCta.href}
                            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-background/40 backdrop-blur-sm transition-colors"
                          >
                            {slide.secondaryCta.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows — desktop only, fade in on hover */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-md border border-primary/25 hover:bg-background/80 transition-all hidden md:flex items-center justify-center opacity-0 group-hover/hero:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-md border border-primary/25 hover:bg-background/80 transition-all hidden md:flex items-center justify-center opacity-0 group-hover/hero:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress segments */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 w-24 sm:w-28 flex gap-1">
        {slides.map((_, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group/seg flex-1 h-[3px] rounded-full bg-foreground/15 backdrop-blur-sm overflow-hidden"
            >
              <span
                key={`fill-${selectedIndex}-${index}`}
                className={cn(
                  "block h-full rounded-full bg-primary",
                  active && autoplayActive ? "animate-[heroProgress_var(--hero-dur)_linear_forwards]" : active ? "w-full" : "w-0",
                )}
                style={{ ["--hero-dur" as any]: `${autoplayDelay}ms` }}
              />
            </button>
          );
        })}
      </div>

      {/* Keyframes injected once via style tag (kept local to component) */}
      <style>{`@keyframes heroProgress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}
