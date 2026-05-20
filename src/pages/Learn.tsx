import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearnChat } from "@/components/learn/LearnChat";
import { ThreadList } from "@/components/learn/ThreadList";
import { useAiThreads, useCreateAiThread } from "@/hooks/useAiTutor";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";

export default function Learn() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: threads, isLoading } = useAiThreads();
  const createThread = useCreateAiThread();

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
      <AppLayout showBottomNav fillViewport>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <img src={tutorAvatar} alt="ASIKON AI Tutor" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gradient">ASIKON AI Tutor</h1>
          <p className="text-muted-foreground mb-4">সাইন ইন করো তোমার AI শিক্ষকের সাথে কথা বলতে।</p>
          <Button onClick={() => navigate("/auth")}>Sign in</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav fillViewport>
      <div className="flex h-full">
        <aside className="hidden lg:flex w-64 border-r border-border flex-col">
          <ThreadList activeId={threadId} />
        </aside>
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
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
