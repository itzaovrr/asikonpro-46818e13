import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tags, MessagesSquare, Palette, Settings as SettingsIcon, Home } from "lucide-react";

const primary = [
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true },
  { title: "Users", url: "/asikonasik/users", icon: Users },
  { title: "Products", url: "/asikonasik/products", icon: Package },
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag },
];

const more = [
  { title: "Categories", url: "/asikonasik/categories", icon: Tags },
  { title: "Community", url: "/asikonasik/community", icon: MessagesSquare },
  { title: "POD Designs", url: "/asikonasik/pod", icon: Palette },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon },
  { title: "Back to app", url: "/", icon: Home },
];

export function AdminBottomNav() {
  const { pathname } = useLocation();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Admin bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {primary.map((item) => {
          const active = isActive(item.url, item.end);
          return (
            <li key={item.url}>
              <NavLink
                to={item.url}
                end={item.end}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
                <span>{item.title}</span>
              </NavLink>
            </li>
          );
        })}
        <li>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="w-full flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
                <span>More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader className="text-left">
                <SheetTitle>Admin menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 mt-4 pb-4">
                {more.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}
