import { Bell, Heart, MessageCircle, Package, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'order' | 'live';
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'like', message: 'Sarah liked your post', time: '2m ago', read: false },
  { id: '2', type: 'comment', message: 'Alex commented on your review', time: '15m ago', read: false },
  { id: '3', type: 'order', message: 'Your order #1234 has shipped', time: '1h ago', read: true },
  { id: '4', type: 'live', message: 'StyleMaster is now live!', time: '2h ago', read: true },
];

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  order: Package,
  live: Radio,
};

const colorMap = {
  like: 'text-pink-500',
  comment: 'text-blue-500',
  order: 'text-green-500',
  live: 'text-primary',
};

export function NotificationsMenu() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <ScrollArea className="h-[300px]">
          {mockNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <DropdownMenuItem 
                key={notification.id} 
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div className={`mt-0.5 ${colorMap[notification.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                )}
              </DropdownMenuItem>
            );
          })}
        </ScrollArea>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-primary">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
