import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product } from "@/types";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  viewAllHref?: string;
  className?: string;
}

export function ProductCarousel({ products, title, viewAllHref, className }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Header — editorial style */}
      {(title || viewAllHref) && (
        <div className="flex items-end justify-between gap-3 mb-3 sm:mb-4 px-3 sm:px-4 lg:px-0">
          <div className="flex items-stretch gap-3 min-w-0">
            <span
              aria-hidden
              className="w-[3px] rounded-full self-stretch shrink-0"
              style={{ background: "var(--gradient-primary)" }}
            />
            {title && (
              <h2 className="font-display text-[17px] sm:text-xl lg:text-2xl font-semibold tracking-tight truncate">
                {title}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                to={viewAllHref}
                className="text-[12px] sm:text-[13px] font-semibold text-primary hover:underline underline-offset-4"
              >
                View all
              </Link>
            )}
            <div className="hidden md:flex items-center gap-1.5">
              <CarouselArrow direction="prev" disabled={!canPrev} onClick={scrollPrev} />
              <CarouselArrow direction="next" disabled={!canNext} onClick={scrollNext} />
            </div>
          </div>
        </div>
      )}

      {/* Carousel with edge fades */}
      <div className="relative">
        {/* Edge gradient fades — desktop only */}
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3 lg:gap-4 pl-4 lg:pl-0 items-stretch">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_23%] xl:flex-[0_0_19%] min-w-0 h-auto"
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "h-9 w-9 grid place-items-center rounded-full",
        "bg-card/70 backdrop-blur-xl border border-border/60",
        "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40",
        "transition-all duration-200 active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-card/70 disabled:hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
