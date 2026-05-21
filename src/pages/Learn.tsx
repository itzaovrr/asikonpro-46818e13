import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { LearnChat } from "@/components/learn/LearnChat";
import { ThreadList } from "@/components/learn/ThreadList";
import { useAiThreads, useCreateAiThread } from "@/hooks/useAiTutor";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";

function LearnSkeleton() {
  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden lg:flex w-64 border-r border-border flex-col p-3 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <div className="mt-4 space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0 p-4 gap-3">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-3/4 rounded-2xl" />
        <div className="mt-auto">
          <Skeleton className="h-14 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

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

  // Still resolving auth → skeleton (no blank flash)
  if (loading) {
    return (
      <AppLayout showBottomNav fillViewport>
        <Helmet>
          <title>Apu · AI Tutor — Asikon</title>
        </Helmet>
        <LearnSkeleton />
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout showBottomNav fillViewport>
        <Helmet>
          <title>Apu · AI Tutor — Asikon</title>
          <meta name="description" content="Chat 24/7 with Apu, your personal AI tutor for SSC, HSC, and beyond." />
        </Helmet>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <img src={tutorAvatar} alt="Apu, your ASIKON tutor" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gradient">Hi, I'm Apu</h1>
          <p className="text-muted-foreground mb-4">Sign in to start chatting with Apu.</p>
          <Button onClick={() => navigate("/auth?redirect=/learn")}>Sign in</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav fillViewport>
      <Helmet>
        <title>Apu · AI Tutor — Asikon</title>
        <meta name="description" content="Chat with Apu, your 24/7 AI study buddy on Asikon. Get answers, MCQs, and revision plans in seconds." />
      </Helmet>
      <div className="flex h-full min-h-0">
        <aside className="hidden lg:flex w-64 border-r border-border flex-col">
          <ThreadList activeId={threadId} />
        </aside>
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {threadId ? (
            <LearnChat key={threadId} threadId={threadId} />
          ) : isLoading ? (
            <LearnSkeleton />
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
