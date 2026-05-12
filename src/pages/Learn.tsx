import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearnChat } from "@/components/learn/LearnChat";
import { ThreadList, ThreadListSheet } from "@/components/learn/ThreadList";
import { useAiThreads, useCreateAiThread } from "@/hooks/useAiTutor";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Learn() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: threads, isLoading } = useAiThreads();
  const createThread = useCreateAiThread();

  // Auto-redirect to most recent thread or create one
  useEffect(() => {
    if (loading || isLoading || threadId || !user) return;
    if (threads && threads.length > 0) {
      navigate(`/learn/${threads[0].id}`, { replace: true });
    } else if (!createThread.isPending && threads && threads.length === 0) {
      createThread.mutateAsync().then((t) => navigate(`/learn/${t.id}`, { replace: true }));
    }
  }, [threads, threadId, isLoading, loading, user]);

  if (!loading && !user) {
    return (
      <AppLayout showBottomNav>
        <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
          <Sparkles className="w-12 h-12 text-primary mb-3" />
          <h1 className="text-2xl font-bold mb-2 text-gradient">ASIKON AI Tutor</h1>
          <p className="text-muted-foreground mb-4">সাইন ইন করো তোমার AI শিক্ষকের সাথে কথা বলতে।</p>
          <Button onClick={() => navigate("/auth")}>Sign in</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav>
      <div className="flex h-[calc(100dvh-var(--app-header-h,56px)-64px)] lg:h-[calc(100dvh-var(--app-header-h,64px))]">
        {/* Desktop thread list */}
        <aside className="hidden lg:flex w-64 border-r border-border flex-col">
          <ThreadList activeId={threadId} />
        </aside>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center gap-2 px-3 py-2 border-b border-border glass-subtle sticky top-0 z-10">
            <ThreadListSheet activeId={threadId} />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">ASIKON AI Tutor</span>
            </div>
          </header>
          {threadId ? (
            <LearnChat key={threadId} threadId={threadId} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Loading your chat...
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
