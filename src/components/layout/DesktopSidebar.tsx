import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Library,
  Users,
  Gamepad2,
  User,
  Heart,
  ShoppingCart,
  Package,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Wand2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  /** True when only icons are visible (collapsed AND not hovered open) */
  iconOnly: boolean;
  /** True when collapsed (used to enable tooltips even while hover-expanded settles) */
  isCollapsed: boolean;
  badge?: string;
  innerRef?: React.Ref<HTMLAnchorElement>;
}

function NavItem({ icon: Icon, label, href, isActive, iconOnly, isCollapsed, badge, innerRef }: NavItemProps) {
  const content = (
    <Link
      ref={innerRef}
      to={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group/navitem relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
        "hover:translate-x-[1px]",
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
        iconOnly && "justify-center px-2 hover:translate-x-0"
      )}
      style={
        isActive
          ? { background: "var(--gradient-primary-soft)" }
          : undefined
      }
    >
      {/* Active accent bar */}
      <span
        className={cn(
          "absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-opacity",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{ background: "var(--gradient-primary)" }}
        aria-hidden
      />
      <span
        className={cn(
          "grid place-items-center h-8 w-8 rounded-lg shrink-0 transition-all duration-200",
          isActive
            ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
            : "text-current group-hover/navitem:bg-secondary/60"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      {!iconOnly && (
        <>
          <span className="flex-1 truncate text-[13px] tracking-[-0.005em]">{label}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (iconOnly && isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

interface DesktopSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function DesktopSidebar({ 
  className, 
  isCollapsed: controlledIsCollapsed,
  onCollapsedChange 
}: DesktopSidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const location = useLocation();
  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = onCollapsedChange ?? setInternalIsCollapsed;

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Library, label: "Library", href: "/shop" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Gamepad2, label: "Game & Rewards", href: "/game" },
  ];

  const shopNavItems = [
    { icon: GraduationCap, label: "Courses", href: "/shop?type=courses" },
    { icon: BookOpen, label: "Books", href: "/shop?type=books" },
    { icon: Package, label: "Student Kits", href: "/shop?type=kits" },
    { icon: Wand2, label: "Prompt Library", href: "/prompts" },
    { icon: Sparkles, label: "New Arrivals", href: "/shop?filter=new" },
  ];

  const userNavItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", badge: "2" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Orders", href: "/orders" },
  ];

  const bottomNavItems = [
    { icon: Sparkles, label: "About ASIKON", href: "/about" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  // Hover-to-expand when collapsed (visual only — main content padding stays at w-16)
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const expanded = !isCollapsed || isHoverExpanded;
  const iconOnly = isCollapsed && !isHoverExpanded;

  // Scroll the active nav item into view on route change
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [location.pathname, location.search]);

  const renderItem = (item: { icon: React.ElementType; label: string; href: string; badge?: string }, active: boolean) => (
    <NavItem
      key={item.href}
      {...item}
      isActive={active}
      iconOnly={iconOnly}
      isCollapsed={isCollapsed}
      innerRef={active ? activeRef : undefined}
    />
  );

  return (
    <aside
      style={{ top: "var(--app-header-h)" }}
      onMouseEnter={() => isCollapsed && setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
      className={cn(
        "fixed left-0 bottom-0 z-30 hidden lg:flex flex-col border-r border-border bg-background/95 backdrop-blur-md transition-[width,box-shadow] duration-300 ease-out will-change-[width]",
        expanded ? "w-60" : "w-16",
        // Lift overlay shadow when hover-expanding so it visually floats above main content
        isCollapsed && isHoverExpanded && "shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={isCollapsed ? "Expand sidebar (Ctrl/Cmd+B)" : "Collapse sidebar (Ctrl/Cmd+B)"}
        title={isCollapsed ? "Expand (Ctrl/Cmd+B)" : "Collapse (Ctrl/Cmd+B)"}
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-secondary"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <ScrollArea className="flex-1 py-4 [&>[data-radix-scroll-area-viewport]]:overscroll-contain">
        <div className="space-y-6 px-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            {expanded && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-200">
                Menu
              </p>
            )}
            {mainNavItems.map((item) =>
              renderItem(item, location.pathname === item.href)
            )}
          </div>

          <Separator className="mx-3" />

          {/* Library Categories */}
          <div className="space-y-1">
            {expanded && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-200">
                Library
              </p>
            )}
            {shopNavItems.map((item) =>
              renderItem(item, location.pathname + location.search === item.href)
            )}
          </div>

          <Separator className="mx-3" />

          {/* User Navigation */}
          <div className="space-y-1">
            {expanded && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-200">
                Account
              </p>
            )}
            {userNavItems.map((item) =>
              renderItem(item, location.pathname === item.href)
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-3 space-y-1">
        {bottomNavItems.map((item) =>
          renderItem(item, location.pathname === item.href)
        )}
      </div>
    </aside>
  );
}
