import { 
  Package, 
  Heart, 
  LayoutDashboard, 
  Gift, 
  HelpCircle, 
  Info 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

interface SidebarSecondaryProps {
  onClose?: () => void;
}

export function SidebarSecondary({ onClose }: SidebarSecondaryProps) {
  const location = useLocation();

  const items = [
    { icon: <Package className="w-5 h-5" />, label: "My Orders", href: "/orders" },
    { icon: <Heart className="w-5 h-5" />, label: "Wishlist", href: "/wishlist" },
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Creator Dashboard", href: "/creator" },
    { icon: <Gift className="w-5 h-5" />, label: "Refer & Earn", href: "/referral" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Support / Help", href: "/support" },
    { icon: <Info className="w-5 h-5" />, label: "About Brand", href: "/about" },
  ];

  return (
    <div className="px-2 py-2 border-t border-border">
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location.pathname === item.href}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  );
}
