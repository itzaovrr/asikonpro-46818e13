import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const LABEL_MAP: Record<string, string> = {
  shop: "Library",
  community: "Community",
  game: "Game & Rewards",
  profile: "Profile",
  cart: "Cart",
  checkout: "Checkout",
  wishlist: "Wishlist",
  orders: "Orders",
  about: "About",
  settings: "Settings",
  help: "Help",
  prompts: "Prompts",
  mentorship: "Mentorship",
};

interface BreadcrumbsProps {
  className?: string;
}

/**
 * Compact breadcrumb derived from the current route.
 * Renders nothing on the home page.
 */
export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const crumbs = parts.map((seg, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const label =
      LABEL_MAP[seg.toLowerCase()] ??
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label, isLast: i === parts.length - 1 };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "hidden lg:flex items-center gap-1.5 text-[12px] text-muted-foreground",
        className
      )}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {crumbs.map((c) => (
        <span key={c.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />
          {c.isLast ? (
            <span className="text-foreground font-medium">{c.label}</span>
          ) : (
            <Link to={c.href} className="hover:text-foreground transition-colors">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
