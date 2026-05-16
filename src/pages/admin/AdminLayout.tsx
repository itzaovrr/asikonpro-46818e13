import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  MessagesSquare,
  Palette,
  ShoppingBag,
  Settings as SettingsIcon,
  ShieldCheck,
  Home,
  Bell,
  LogOut,
  Search,
  LayoutGrid,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { AdminGuard } from "./AdminGuard";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdminBottomNav } from "./AdminBottomNav";
import { Reveal } from "@/components/transitions/Reveal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";

export const adminNavItems = [
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true },
  { title: "Users", url: "/asikonasik/users", icon: Users },
  { title: "Products", url: "/asikonasik/products", icon: Package },
  { title: "Categories", url: "/asikonasik/categories", icon: Tags },
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag },
  { title: "Community", url: "/asikonasik/community", icon: MessagesSquare },
  { title: "POD Designs", url: "/asikonasik/pod", icon: Palette },
  { title: "Home Sections", url: "/asikonasik/home-sections", icon: LayoutGrid },
  { title: "Tracks", url: "/asikonasik/tracks", icon: GraduationCap },
  { title: "Lessons", url: "/asikonasik/lessons", icon: BookOpen },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon },
];

function pageMeta(pathname: string) {
  const found = adminNavItems.find((i) =>
    i.end ? pathname === i.url : pathname === i.url || pathname.startsWith(i.url + "/"),
  );
  return found ?? adminNavItems[0];
}

function AdminSidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useIsAdmin();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r border-border/60"
      style={{ background: "var(--gradient-surface)" }}
    >
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-[var(--shadow-glow)]">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold leading-tight truncate">asikonasik</div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {isSuperAdmin ? "Super Admin" : "Admin Panel"}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          Manage
        </p>
        {adminNavItems.map((item) => {
          const active = isActive(item.url, item.end);
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.end}
              className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm pressable transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <span
                className={`grid place-items-center h-8 w-8 rounded-lg transition-all ${
                  active
                    ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="font-medium truncate">{item.title}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </NavLink>
          );
        })}

        <div className="px-2 pt-4 pb-1">
          <div className="divider-soft" />
        </div>
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 pressable"
        >
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-muted/60">
            <Home className="h-4 w-4" />
          </span>
          <span className="font-medium">Back to app</span>
        </NavLink>
      </nav>

      <div className="p-3">
        <div className="glass-subtle rounded-xl p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-0.5">Tip</p>
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">⌘K</kbd> to jump anywhere.
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isSuperAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const initial = (user?.email ?? "A").slice(0, 1).toUpperCase();
  const meta = useMemo(() => pageMeta(pathname), [pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const q = search.trim().toLowerCase();
    if (!q) return;
    const hit = adminNavItems.find((i) => i.title.toLowerCase().includes(q));
    if (hit) {
      navigate(hit.url);
      setSearch("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header
            className="h-16 sticky top-0 z-30 border-b border-border/50 flex items-center px-3 md:px-6 gap-3 glass-strong"
          >
            <div className="md:hidden h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-[var(--shadow-glow)]">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground hidden sm:block">
                asikonasik · {isSuperAdmin ? "Super Admin" : "Admin"}
              </div>
              <h1 className="text-base sm:text-lg font-display font-semibold tracking-tight truncate">
                <span className="text-gradient">{meta.title}</span>
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Jump to…  ⌘K"
                  className="h-9 w-56 pl-8 bg-background/60 border-border/60"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pressable rounded-full pl-1 pr-2 py-1 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                      <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="hidden sm:inline-flex text-[10px]">
                      {isSuperAdmin ? "Super Admin" : "Admin"}
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Users className="h-4 w-4 mr-2" /> My profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <Home className="h-4 w-4 mr-2" /> Back to app
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main
            className="flex-1 px-3 md:px-6 py-4 md:py-6 md:pb-8 overflow-x-hidden"
            style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <Reveal>
              <Outlet />
            </Reveal>
          </main>
        </div>

        <AdminBottomNav />
      </div>
    </AdminGuard>
  );
}
