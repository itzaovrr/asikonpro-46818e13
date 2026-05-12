import { Play, Heart, Eye, ShoppingBag, BadgeCheck } from "lucide-react";
import { Short } from "@/types/community";

interface ShortCardProps {
  short: Short;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function ShortCard({ short }: ShortCardProps) {
  const views = (short.likes ?? 0) * 12 + (short.comments ?? 0) * 30;

  return (
    <article className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-[var(--shadow-glow)] transition-all duration-300">
      {/* Thumbnail */}
      <img
        src={short.thumbnailUrl}
        alt={short.description}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />

      {/* Top + bottom gradients for legibility */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Top row — views + verified */}
      <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
        {short.isVerifiedBuyer ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-semibold text-white backdrop-blur-sm">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        ) : (
          <span />
        )}

        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/55 text-[10px] font-medium text-white backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {formatCount(views)}
        </span>
      </div>

      {/* Center play badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <Play className="h-5 w-5 fill-white text-white ml-0.5" />
        </div>
      </div>

      {/* Right rail — like count only (compact) */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-1 text-white">
        <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
          <Heart className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-semibold drop-shadow">
          {formatCount(short.likes ?? 0)}
        </span>
      </div>

      {/* Product chip */}
      {short.products && short.products.length > 0 && (
        <button
          className="absolute left-2 bottom-[68px] inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold text-primary-foreground shadow-md backdrop-blur-sm"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ShoppingBag className="h-3 w-3" />${short.products[0].price}
        </button>
      )}

      {/* Bottom — creator + caption */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
        <div className="flex items-center gap-1.5 mb-1">
          <img
            src={short.user.avatar}
            alt=""
            className="w-5 h-5 rounded-full ring-1 ring-white/40 object-cover"
          />
          <span className="text-[11px] font-semibold truncate drop-shadow">
            @{short.user.username}
          </span>
        </div>
        <p className="text-[11px] leading-snug line-clamp-2 text-white/90 drop-shadow">
          {short.description}
        </p>
      </div>
    </article>
  );
}
