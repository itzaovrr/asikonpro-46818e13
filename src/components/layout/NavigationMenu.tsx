import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Community", href: "/community" },
  { label: "Game", href: "/game" },
  { label: "Trending", href: "/shop?filter=trending" },
  { label: "New Arrivals", href: "/shop?filter=new" },
];

const categories = [
  { label: "T-Shirts", href: "/shop?category=tshirts", icon: "👕" },
  { label: "Hoodies", href: "/shop?category=hoodies", icon: "🧥" },
  { label: "Sneakers", href: "/shop?category=sneakers", icon: "👟" },
  { label: "Bags", href: "/shop?category=bags", icon: "👜" },
  { label: "Jackets", href: "/shop?category=jackets", icon: "🧥" },
  { label: "Accessories", href: "/shop?category=accessories", icon: "💎" },
];

export function NavigationMenu() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== "/" && location.pathname.startsWith(item.href.split("?")[0]));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {item.label}
          </Link>
        );
      })}

      {/* Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors">
            Categories
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {categories.map((category) => (
            <DropdownMenuItem key={category.href} asChild>
              <Link to={category.href} className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
