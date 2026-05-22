import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeBanners } from "@/hooks/useHomeBanners";
import { cn } from "@/lib/utils";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const FALLBACK_BANNERS = [
  {
    id: "fb-1",
    image_url: courseAiMl,
    alt_text: "Learn AI with Asikon",
    link_url: "/shop?type=courses",
    eyebrow: "New course",
    title: "Master AI & ML",
    subtitle: "Expert-led courses in Python, ML and modern AI tools",
  },
  {
    id: "fb-2",
    image_url: promptLibrary,
    alt_text: "1000+ AI Prompts",
    link_url: "/prompts",
    eyebrow: "Prompt library",
    title: "1000+ AI Prompts",
    subtitle: "Boost your productivity with our curated prompts",
  },
  {
    id: "fb-3",
    image_url: coursePython,
    alt_text: "Skill-Up Friday — 50% off",
    link_url: "/shop?filter=deals",
    eyebrow: "Limited deal",
    title: "Skill-Up Friday",
    subtitle: "50% off on top-rated courses and books — this week only",
  },
];

export function ImageHeroSlider() {
  const { data: banners, isLoading } = useHomeBanners("hero");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="section-x">
        <Skeleton className="w-full aspect-[21/10] rounded-3xl" />
      </div>
    );
  }

  const items = (banners && banners.length > 0 ? banners : FALLBACK_BANNERS) as Array<{
    id: string;
    image_url: string;
    alt_text?: string | null;
    link_url?: string | null;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  }>;
  if (items.length === 0) return null;

  return (
    <section className="section-x">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {items.map((b) => {
            const Inner = (
              <div className="relative w-full aspect-[21/10] rounded-3xl overflow-hidden shadow-xl shadow-primary/10 border border-border/40">
                <img
                  src={b.image_url}
                  alt={b.alt_text ?? b.title ?? "Promotional banner"}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {(b.title || b.subtitle || b.eyebrow) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {b.eyebrow && (
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-background/70 backdrop-blur border border-primary/25 text-foreground mb-1.5">
                          {b.eyebrow}
                        </span>
                      )}
                      {b.title && (
                        <h2 className="font-display font-bold text-lg leading-tight text-foreground">
                          <span className="text-gradient">{b.title}</span>
                        </h2>
                      )}
                      {b.subtitle && (
                        <p className="mt-1 text-xs text-foreground/80 line-clamp-2">{b.subtitle}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
            return (
              <div
                key={b.id}
                className="shrink-0 grow-0 basis-[88%] sm:basis-[70%] md:basis-[55%] pressable"
              >
                {b.link_url ? (
                  <Link to={b.link_url} className="block focus-ring rounded-3xl">
                    {Inner}
                  </Link>
                ) : (
                  Inner
                )}
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i ? "w-5 bg-primary" : "w-1.5 bg-foreground/20",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
