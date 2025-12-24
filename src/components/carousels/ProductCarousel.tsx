import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      {(title || viewAllHref) && (
        <div className="flex items-center justify-between mb-3 px-4 lg:px-0">
          {title && <h2 className="font-semibold text-lg">{title}</h2>}
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <a href={viewAllHref} className="text-sm text-primary hover:underline">
                View All
              </a>
            )}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={scrollPrev}
                className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={scrollNext}
                className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 pl-4 lg:pl-0">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_18%] min-w-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
