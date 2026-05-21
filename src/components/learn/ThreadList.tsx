import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2, PanelLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAiThreads,
  useCreateAiThread,
  useDeleteAiThread,
  type AiThread,
} from "@/hooks/useAiTutor";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  activeId?: string;
}

function groupThreads(threads: AiThread[]) {
  const now = Date.now();
  const day = 86_400_000;
  const groups: Record<string, AiThread[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    Older: [],
  };
  for (const t of threads) {
    const age = now - new Date(t.updated_at).getTime();
    if (age < day) groups.Today.push(t);
    else if (age < 2 * day) groups.Yesterday.push(t);
    else if (age < 7 * day) groups["Previous 7 days"].push(t);
    else groups.Older.push(t);
  }
  return groups;
}

export function ThreadList({ activeId }: Props) {
  const { data: threads = [], isLoading } = useAiThreads();
  const create = useCreateAiThread();
  const del = useDeleteAiThread();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return threads;
    return threads.filter((t) => t.title.toLowerCase().includes(needle));
  }, [threads, q]);

  const grouped = useMemo(() => groupThreads(filtered), [filtered]);

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
      <div className="p-3 border-b border-border space-y-2">
        <Button
          onClick={handleNew}
          className="w-full gradient-primary text-primary-foreground hover:opacity-95"
          disabled={create.isPending}
        >
          <Plus className="w-4 h-4 mr-2" /> New chat
        </Button>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your chats"
            className="h-9 pl-8 text-sm rounded-full bg-card/60"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-1.5 px-1 py-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              {q
                ? "No chats match your search."
                : "No chats yet — start your first conversation with Apu."}
            </div>
          ) : (
            Object.entries(grouped).map(([label, list]) =>
              list.length === 0 ? null : (
                <div key={label} className="mb-3">
                  <div className="px-2.5 pt-2 pb-1 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70 font-semibold">
                    {label}
                  </div>
                  <div className="space-y-0.5">
                    {list.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => navigate(`/learn/${t.id}`)}
                        className={cn(
                          "group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors",
                          t.id === activeId
                            ? "bg-primary/10 text-foreground"
                            : "hover:bg-secondary/60 text-foreground/85",
                        )}
                      >
                        <MessageSquare
                          className={cn(
                            "w-3.5 h-3.5 flex-shrink-0",
                            t.id === activeId ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-sm flex-1 truncate">{t.title}</span>
                        <button
                          onClick={(e) => handleDelete(e, t.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )
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
        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden h-9 rounded-full px-3 shadow-md backdrop-blur bg-secondary/80 border border-border"
        >
          <PanelLeft className="w-4 h-4 mr-1.5" />
          <span className="text-xs font-medium">Chats</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-3 border-b border-border">
          <SheetTitle>Your chats</SheetTitle>
        </SheetHeader>
        <ThreadList activeId={activeId} />
      </SheetContent>
    </Sheet>
  );
}
