import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: string;
  href?: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryName: string) => void;
  className?: string;
}

export function CategoryCarousel({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  className 
}: CategoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 3,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/90 border border-border shadow-sm hover:bg-secondary transition-colors hidden md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/90 border border-border shadow-sm hover:bg-secondary transition-colors hidden md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden mx-4 md:mx-6">
        <div className="flex gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0",
                  isActive
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
