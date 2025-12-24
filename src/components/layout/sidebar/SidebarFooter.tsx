import { Moon, Sun, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

interface SidebarFooterProps {
  onClose?: () => void;
}

export function SidebarFooter({ onClose }: SidebarFooterProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    // TODO: Implement logout
    onClose?.();
  };

  return (
    <div className="p-4 border-t border-border space-y-3">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>Dark Mode</span>
        </div>
        <Switch 
          checked={isDark} 
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>

      {/* Language Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Language</span>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs font-medium bg-primary/10 text-primary"
          >
            EN
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            বাং
          </Button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Version 1.0.0
      </div>

      {/* Logout */}
      <Button 
        variant="ghost" 
        className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
