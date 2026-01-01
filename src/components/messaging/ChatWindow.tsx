import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Image, ArrowLeft, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useSendMessage, useMarkMessagesRead, Chat, Message } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ChatWindowProps {
  chat: Chat;
  onBack?: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(chat.id);
  const sendMessage = useSendMessage();
  const markRead = useMarkMessagesRead();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.id) {
      markRead.mutate(chat.id);
    }
  }, [chat.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    sendMessage.mutate(
      { chatId: chat.id, content: newMessage.trim() },
      { onSuccess: () => setNewMessage("") }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border glass-strong">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Link to={`/profile/${chat.other_user?.username || chat.other_user?.id}`}>
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={chat.other_user?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {chat.other_user?.full_name?.[0] || chat.other_user?.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {chat.other_user?.full_name || chat.other_user?.username || "Unknown"}
          </h3>
          <p className="text-xs text-muted-foreground">
            @{chat.other_user?.username || "unknown"}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Avatar className="h-16 w-16 mb-4 border-2 border-border">
              <AvatarImage src={chat.other_user?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {chat.other_user?.full_name?.[0] || chat.other_user?.username?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mb-1">
              Start a conversation with {chat.other_user?.full_name || chat.other_user?.username}
            </h3>
            <p className="text-sm text-muted-foreground">
              Say hello and start chatting!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages?.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user?.id}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border glass-strong">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Image className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMessage.isPending}
            className="gradient-primary border-0 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isOwn
            ? "gradient-primary text-primary-foreground rounded-br-md"
            : "bg-secondary rounded-bl-md"
        )}
      >
        {message.content && <p className="text-sm">{message.content}</p>}
        {message.media_url && (
          <img
            src={message.media_url}
            alt="Media"
            className="max-w-full rounded-lg mt-2"
          />
        )}
        <p
          className={cn(
            "text-[10px] mt-1",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {message.created_at
            ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
            : "Just now"}
        </p>
      </div>
    </div>
  );
}
