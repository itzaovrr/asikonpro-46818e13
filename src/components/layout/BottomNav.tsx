import { type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";
import { useCart } from "@/hooks/useCart";
import asikonMark from "@/assets/icons/asikon-mark.svg";

const AsikonIcon: React.FC<React.SVGProps<SVGSVGElement> & { strokeWidth?: number }> = ({ className }) => (
  <img
    src={asikonMark}
    alt=""
    aria-hidden
    className={className as string}
    style={{ objectFit: "contain" }}
  />
);

type IconComponent =
  | LucideIcon
  | React.FC<React.SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

/* ---------- Home ---------- */
const HomeOutline: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
      stroke="currentColor"
      strokeWidth={1.5}
    />
    <path d="M15 18H9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);
const HomeFill: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.5}
    />
    <path
      d="M15 18H9"
      stroke="hsl(var(--background))"
      strokeWidth={1.75}
      strokeLinecap="round"
    />
  </svg>
);

/* ---------- Shop (search-square) ---------- */
const ShopOutline: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17.5556 3C19.4579 3 21 4.54213 21 6.44444V17.5556C21 19.4579 19.4579 21 17.5556 21H6.44444C4.54213 21 3 19.4579 3 17.5556V6.44444C3 4.54213 4.54213 3 6.44444 3H17.5556Z"
      stroke="currentColor"
      strokeWidth={1.75}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5067 7.01392C9.02527 7.01392 7.01367 9.02551 7.01367 11.5069C7.01367 13.9884 9.02527 16 11.5067 16C12.3853 16 13.205 15.7478 13.8973 15.3119L15.1658 16.5803C15.5563 16.9709 16.1895 16.9709 16.58 16.5803C16.9705 16.1898 16.9705 15.5566 16.58 15.1661L15.3116 13.8977C15.7475 13.2053 15.9997 12.3856 15.9997 11.5069C15.9997 9.02551 13.9881 7.01392 11.5067 7.01392ZM9.01367 11.5069C9.01367 10.1301 10.1298 9.01392 11.5067 9.01392C12.8836 9.01392 13.9997 10.1301 13.9997 11.5069C13.9997 12.8838 12.8836 14 11.5067 14C10.1298 14 9.01367 12.8838 9.01367 11.5069Z"
      fill="currentColor"
    />
  </svg>
);
const ShopFill: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17.5556 3C19.4579 3 21 4.54213 21 6.44444V17.5556C21 19.4579 19.4579 21 17.5556 21H6.44444C4.54213 21 3 19.4579 3 17.5556V6.44444C3 4.54213 4.54213 3 6.44444 3H17.5556Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5067 7.01392C9.02527 7.01392 7.01367 9.02551 7.01367 11.5069C7.01367 13.9884 9.02527 16 11.5067 16C12.3853 16 13.205 15.7478 13.8973 15.3119L15.1658 16.5803C15.5563 16.9709 16.1895 16.9709 16.58 16.5803C16.9705 16.1898 16.9705 15.5566 16.58 15.1661L15.3116 13.8977C15.7475 13.2053 15.9997 12.3856 15.9997 11.5069C15.9997 9.02551 13.9881 7.01392 11.5067 7.01392ZM9.01367 11.5069C9.01367 10.1301 10.1298 9.01392 11.5067 9.01392C12.8836 9.01392 13.9997 10.1301 13.9997 11.5069C13.9997 12.8838 12.8836 14 11.5067 14C10.1298 14 9.01367 12.8838 9.01367 11.5069Z"
      fill="hsl(var(--background))"
    />
  </svg>
);

/* ---------- Community (heart) ---------- */
const CommunityOutline: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />
  </svg>
);
const CommunityFill: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z" />
  </svg>
);

/* ---------- Profile ---------- */
const ProfileOutline: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z"
      stroke="currentColor"
      strokeWidth={1.5}
    />
  </svg>
);
const ProfileFill: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z"
    />
  </svg>
);

interface Tab {
  id: Exclude<TabId, null>;
  iconOutline: IconComponent;
  iconFill: IconComponent;
  label: string;
  path: string;
}

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);
  const { data: cart } = useCart();
  const cartCount = cart?.length ?? 0;

  const tabs: (Tab & { badge?: number; dot?: boolean })[] = [
    { id: "home", iconOutline: HomeOutline, iconFill: HomeFill, label: "Home", path: "/" },
    { id: "explore", iconOutline: ShopOutline, iconFill: ShopFill, label: "Shop", path: "/shop", badge: cartCount },
    { id: "ai", iconOutline: AsikonIcon, iconFill: AsikonIcon, label: "AI", path: "/learn" },
    { id: "community", iconOutline: CommunityOutline, iconFill: CommunityFill, label: "Community", path: "/community", dot: false },
    { id: "profile", iconOutline: ProfileOutline, iconFill: ProfileFill, label: "Profile", path: "/profile" },
  ];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 h-[var(--bottom-nav-h)] overflow-hidden supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]",
        "liquid-nav border-t border-border/40"
      )}
    >
      <ul className="flex h-[72px] items-stretch px-1.5">
        {tabs.map((item) => (
          <li key={item.path} className="flex-1 min-w-0">
            <NavItem item={item} active={activeTab === item.id} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: {
    iconOutline: IconComponent;
    iconFill: IconComponent;
    label: string;
    path: string;
    badge?: number;
    dot?: boolean;
  };
  active: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldFill = active || isHovered;
  const Icon = shouldFill ? item.iconFill : item.iconOutline;
  const { pathname } = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (active && pathname === item.path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showBadge = typeof item.badge === "number" && item.badge > 0;
  const showDot = !!item.dot && !showBadge;

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 select-none touch-manipulation outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span className="relative inline-flex z-10">
        <Icon
          aria-hidden
          className={cn(
            "pointer-events-none h-[24px] w-[24px] transition-all duration-300 ease-out",
            shouldFill
              ? "text-primary -translate-y-0.5 drop-shadow-[0_2px_6px_hsl(var(--primary)/0.55)]"
              : "text-muted-foreground"
          )}
        />

        {showBadge && (
          <span
            aria-label={`${item.badge} items`}
            className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-[0_2px_6px_hsl(var(--primary)/0.45)] ring-2 ring-background"
          >
            {item.badge! > 9 ? "9+" : item.badge}
          </span>
        )}

        {showDot && (
          <span
            aria-label="Unread"
            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background shadow-[0_0_6px_hsl(var(--primary)/0.7)]"
          />
        )}
      </span>

      <span
        className={cn(
          "pointer-events-none relative z-10 text-[10px] leading-none transition-all duration-300",
          shouldFill ? "font-semibold text-primary translate-y-0" : "font-medium text-muted-foreground translate-y-1"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

