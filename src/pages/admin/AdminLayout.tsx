import { NavLink, Outlet, useLocation } from "react-router-dom";
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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminGuard } from "./AdminGuard";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdminBottomNav } from "./AdminBottomNav";

const items = [
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true },
  { title: "Users", url: "/asikonasik/users", icon: Users },
  { title: "Products", url: "/asikonasik/products", icon: Package },
  { title: "Categories", url: "/asikonasik/categories", icon: Tags },
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag },
  { title: "Community", url: "/asikonasik/community", icon: MessagesSquare },
  { title: "POD Designs", url: "/asikonasik/pod", icon: Palette },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon },
];

function AdminSidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useIsAdmin();

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="px-3 pt-4 pb-3 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center shadow-md shadow-primary/30">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold leading-tight truncate">asikonasik</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {isSuperAdmin ? "Super Admin" : "Admin Panel"}
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url, item.end);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : ""
                      }
                    >
                      <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Shortcut</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Back to app</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function pageTitle(pathname: string) {
  const found = items.find((i) =>
    i.end ? pathname === i.url : pathname === i.url || pathname.startsWith(i.url + "/"),
  );
  return found?.title ?? "Admin";
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isSuperAdmin } = useIsAdmin();
  const initial = (user?.email ?? "A").slice(0, 1).toUpperCase();

  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          {/* Sidebar visible on md+ only */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b border-border flex items-center px-3 md:px-4 gap-3 sticky top-0 z-20 bg-background/80 backdrop-blur-xl">
              <div className="hidden md:block">
                <SidebarTrigger />
              </div>
              <div className="md:hidden h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 grid place-items-center">
                <ShieldCheck className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold truncate">{pageTitle(pathname)}</span>
                <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                  asikonasik
                </Badge>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 pl-1">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                    <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-xs font-medium truncate max-w-[140px]">
                      {user?.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isSuperAdmin ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-x-hidden">
              <Outlet />
            </main>
          </div>

          <AdminBottomNav />
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
