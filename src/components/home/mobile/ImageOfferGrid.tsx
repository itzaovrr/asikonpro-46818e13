import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeBanners } from "@/hooks/useHomeBanners";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const FALLBACK_OFFERS = [
  {
    id: "off-1",
    image_url: courseAiMl,
    alt_text: "AI bundle",
    link_url: "/shop?type=courses",
    label: "AI Bundle",
    sub: "Save 40%",
  },
  {
    id: "off-2",
    image_url: promptLibrary,
    alt_text: "Prompt pack",
    link_url: "/prompts",
    label: "Prompt Pack",
    sub: "1000+ prompts",
  },
  {
    id: "off-3",
    image_url: coursePython,
    alt_text: "Python starter",
    link_url: "/shop?type=courses",
    label: "Python Starter",
    sub: "From ৳499",
  },
];

export function ImageOfferGrid() {
  const { data: banners, isLoading } = useHomeBanners("offer");

  if (isLoading) {
    return (
      <section className="section-x">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  const items = (banners && banners.length > 0 ? banners : FALLBACK_OFFERS) as Array<{
    id: string;
    image_url: string;
    alt_text?: string | null;
    link_url?: string | null;
    label?: string;
    sub?: string;
  }>;
  if (items.length === 0) return null;

  return (
    <section className="section-x">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-semibold text-base">Today's Offers</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.slice(0, 6).map((b) => {
          const inner = (
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              <img
                src={b.image_url}
                alt={b.alt_text ?? b.label ?? "Offer"}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {(b.label || b.sub) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    {b.label && (
                      <p className="text-[11px] font-semibold leading-tight text-foreground truncate">
                        {b.label}
                      </p>
                    )}
                    {b.sub && (
                      <p className="text-[10px] text-primary font-medium truncate">{b.sub}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
          return b.link_url ? (
            <Link key={b.id} to={b.link_url} className="pressable focus-ring rounded-2xl block">
              {inner}
            </Link>
          ) : (
            <div key={b.id}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
