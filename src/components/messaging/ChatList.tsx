import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Chat } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  isLoading?: boolean;
}

export function ChatList({ chats, selectedChatId, onSelectChat, isLoading }: ChatListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation by visiting someone's profile
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
              selectedChatId === chat.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-secondary/50"
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={chat.other_user?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {chat.other_user?.full_name?.[0] || chat.other_user?.username?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              {(chat.unread_count || 0) > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">
                    {chat.unread_count}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">
                  {chat.other_user?.full_name || chat.other_user?.username || "Unknown"}
                </span>
                {chat.last_message_at && (
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: false })}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {chat.last_message || "No messages yet"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
