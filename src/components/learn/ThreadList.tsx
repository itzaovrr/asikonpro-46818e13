import { useNavigate, useParams } from "react-router-dom";
import { Plus, MessageSquare, Trash2, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiThreads, useCreateAiThread, useDeleteAiThread } from "@/hooks/useAiTutor";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  activeId?: string;
}

export function ThreadList({ activeId }: Props) {
  const { data: threads = [], isLoading } = useAiThreads();
  const create = useCreateAiThread();
  const del = useDeleteAiThread();
  const navigate = useNavigate();

  const handleNew = async () => {
    const t = await create.mutateAsync();
    navigate(`/learn/${t.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await del.mutateAsync(id);
    if (id === activeId) navigate("/learn");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button onClick={handleNew} className="w-full" disabled={create.isPending}>
          <Plus className="w-4 h-4 mr-2" /> New chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <p className="text-sm text-muted-foreground p-2">Loading...</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">কোনো chat নেই। নতুন একটা শুরু করো।</p>
          ) : (
            threads.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/learn/${t.id}`)}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-secondary/60 transition",
                  t.id === activeId && "bg-secondary",
                )}
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{t.title}</span>
                <button
                  onClick={(e) => handleDelete(e, t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                  aria-label="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function ThreadListSheet({ activeId }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" className="lg:hidden h-9 rounded-full px-3 shadow-md backdrop-blur bg-secondary/80 border border-border">
          <PanelLeft className="w-4 h-4 mr-1.5" />
          <span className="text-xs font-medium">Chats</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-3 border-b border-border">
          <SheetTitle>Your chats</SheetTitle>
        </SheetHeader>
        <ThreadList activeId={activeId} />
      </SheetContent>
    </Sheet>
  );
}
