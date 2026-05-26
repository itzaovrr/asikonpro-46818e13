/**
 * Apple-Inspired Hero Slider
 * Responsive, touch-friendly with polished UI
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: string;
  darkOverlay?: boolean;
}

interface AppleHeroSliderProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function AppleHeroSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
}: AppleHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [slides.length, isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto play
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
    setTouchStart(null);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full h-[70vh] min-h-[500px] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out",
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Gradient Overlay */}
            <div
              className={cn(
                "absolute inset-0",
                s.darkOverlay
                  ? "bg-gradient-to-t from-foreground/80 via-foreground/30 to-foreground/20"
                  : "bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent"
              )}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end md:justify-center">
            <div
              className={cn(
                "max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-12 pb-12 md:pb-0 md:text-left",
                "transition-all duration-700 delay-200",
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              {s.eyebrow && (
                <p className="text-xs md:text-sm font-medium tracking-widest uppercase text-white/80 mb-2 md:mb-3">
                  {s.eyebrow}
                </p>
              )}

              <h1
                className={cn(
                  "font-display font-semibold tracking-tight leading-[1.1] text-white",
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
                  "max-w-3xl"
                )}
              >
                {s.title}
              </h1>

              {s.subtitle && (
                <p className="mt-3 md:mt-4 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl">
                  {s.subtitle}
                </p>
              )}

              {/* CTAs */}
              {(s.primaryCta || s.secondaryCta) && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                  {s.primaryCta && (
                    <Link to={s.primaryCta.href}>
                      <Button
                        size="lg"
                        className="rounded-full bg-white text-foreground hover:bg-white/90 px-8"
                      >
                        {s.primaryCta.label}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                  {s.secondaryCta && (
                    <Link to={s.secondaryCta.href}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8"
                      >
                        {s.secondaryCta.label}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Desktop */}
      <div className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 gap-3 z-10">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60 text-xs">
        <ChevronLeft className="w-4 h-4" />
        <span>Swipe</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </section>
  );
}

/**
 * Compact Hero for Mobile
 * Simpler, faster loading
 */
export function AppleHeroMobile({ slide }: { slide: HeroSlide }) {
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-5 pb-8">
        {slide.eyebrow && (
          <p className="text-xs font-medium tracking-widest uppercase text-white/80 mb-2">
            {slide.eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white leading-tight max-w-md">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-2 text-sm text-white/80 max-w-md">
            {slide.subtitle}
          </p>
        )}
        {slide.primaryCta && (
          <Link to={slide.primaryCta.href} className="mt-4">
            <Button size="lg" className="rounded-full bg-white text-foreground px-6">
              {slide.primaryCta.label}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
