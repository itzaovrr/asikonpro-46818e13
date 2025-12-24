import { 
  Home, 
  Users, 
  FileText, 
  Video, 
  Film, 
  Radio, 
  Star, 
  ShoppingBag, 
  Shirt, 
  TrendingUp, 
  Sparkles, 
  Zap,
  ChevronDown,
  Palette,
  Flag,
  Flame,
  Quote,
  GraduationCap
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, href, isActive, onClick }: NavItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-foreground hover:bg-secondary"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

interface SidebarNavProps {
  onClose?: () => void;
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const location = useLocation();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const communityItems = [
    { icon: <Home className="w-5 h-5" />, label: "My Feed", href: "/community" },
    { icon: <FileText className="w-5 h-5" />, label: "Posts", href: "/community?tab=posts" },
    { icon: <Video className="w-5 h-5" />, label: "Videos", href: "/community?tab=videos" },
    { icon: <Film className="w-5 h-5" />, label: "Shorts", href: "/community?tab=shorts" },
    { icon: <Radio className="w-5 h-5" />, label: "Live", href: "/community?tab=live" },
    { icon: <Star className="w-5 h-5" />, label: "Reviews", href: "/community?tab=reviews" },
  ];

  const shopItems = [
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Shop Home", href: "/shop" },
    { icon: <Shirt className="w-5 h-5" />, label: "T-Shirts", href: "/shop?category=tshirts" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Trending", href: "/shop?category=trending" },
    { icon: <Sparkles className="w-5 h-5" />, label: "New Arrivals", href: "/shop?category=new" },
    { icon: <Zap className="w-5 h-5" />, label: "Limited Drops", href: "/shop?category=limited" },
  ];

  const categories = [
    { icon: <Palette className="w-5 h-5" />, label: "Graphic T-Shirts", href: "/shop?category=graphic" },
    { icon: <Flame className="w-5 h-5" />, label: "Trending / Viral", href: "/shop?category=viral" },
    { icon: <Flag className="w-5 h-5" />, label: "Bangla Identity", href: "/shop?category=bangla" },
    { icon: <Zap className="w-5 h-5" />, label: "Streetwear", href: "/shop?category=streetwear" },
    { icon: <Quote className="w-5 h-5" />, label: "Motivation", href: "/shop?category=motivation" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Youth & College", href: "/shop?category=youth" },
  ];

  return (
    <nav className="flex-1 overflow-y-auto py-2 px-2">
      {/* Community Section */}
      <div className="mb-4">
        <div className="px-3 py-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </h4>
        </div>
        <div className="space-y-0.5">
          {communityItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname + location.search === item.href}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* Shop Section */}
      <div className="mb-4">
        <div className="px-3 py-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Shop
          </h4>
        </div>
        <div className="space-y-0.5">
          {shopItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname + location.search === item.href}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* Categories (Expandable) */}
      <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Categories
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              categoriesOpen && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-0.5 mt-1">
            {categories.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname + location.search === item.href}
                onClick={onClose}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}
