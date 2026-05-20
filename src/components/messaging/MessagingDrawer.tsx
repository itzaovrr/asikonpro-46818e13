import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useChats, Chat } from "@/hooks/useMessages";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

interface MessagingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialChatId?: string;
}

export function MessagingDrawer({ open, onOpenChange, initialChatId }: MessagingDrawerProps) {
  const { data: chats, isLoading } = useChats();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // Auto-select chat when initialChatId is provided and chats load
  useEffect(() => {
    if (!open || !initialChatId || !chats) return;
    const chat = chats.find((c) => c.id === initialChatId);
    if (chat && chat.id !== selectedChat?.id) setSelectedChat(chat);
  }, [open, initialChatId, chats, selectedChat?.id]);

  // Reset selection when drawer closes
  useEffect(() => {
    if (!open) setSelectedChat(null);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border glass-strong">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Messages
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 flex overflow-hidden">
          <div
            className={cn(
              "w-full lg:w-80 border-r border-border flex-shrink-0",
              selectedChat ? "hidden lg:block" : "block",
            )}
          >
            <ChatList
              chats={chats || []}
              selectedChatId={selectedChat?.id || null}
              onSelectChat={setSelectedChat}
              isLoading={isLoading}
            />
          </div>

          <div className={cn("flex-1 flex flex-col", selectedChat ? "block" : "hidden lg:flex")}>
            {selectedChat ? (
              <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <MessageCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
