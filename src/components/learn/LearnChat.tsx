import { useMemo, useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  ArrowUp,
  Square,
  ArrowDown,
  BookOpen,
  Brain,
  ListChecks,
  Sparkles as SparklesIcon,
  Heart,
  Mic,
  ChevronDown,
  ChevronUp,
  PanelLeft,
  PenSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAiThreadMessages, useAiThreads, useCreateAiThread } from "@/hooks/useAiTutor";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThreadList } from "@/components/learn/ThreadList";
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";

// Each quick prompt gets its own brand-tinted accent so the icon means something,
// not just decoration: green = subject help, amber = practice, blue = concept,
// primary = planning, rose = wellbeing.
const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    label: "Help me with SSC Math",
    prompt: "I'm struggling with SSC math. Can you walk me through where to start?",
    tint: "text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/15",
  },
  {
    icon: ListChecks,
    label: "Quiz me on photosynthesis",
    prompt: "Give me 5 MCQs on photosynthesis with answers and short explanations.",
    tint: "text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/15",
  },
  {
    icon: Brain,
    label: "Explain Newton's 2nd law",
    prompt: "Explain Newton's second law to me like I'm 12, with one real example.",
    tint: "text-sky-500 bg-sky-500/10 group-hover:bg-sky-500/15",
  },
  {
    icon: SparklesIcon,
    label: "Plan my HSC revision",
    prompt: "Build me a realistic 7-day HSC revision routine I can actually follow.",
    tint: "text-primary bg-primary/10 group-hover:bg-primary/15",
  },
  {
    icon: Heart,
    label: "I need some motivation",
    prompt: "I'm losing confidence before exams. Help me get back on track.",
    tint: "text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/15",
  },
];

// Chips append a real instruction to the next message — each one shapes how
// Apu replies, so they're verbs/modes, not vague vibes.
const ACTION_CHIPS = [
  "Explain like I'm 12",
  "In Bangla please",
  "Quiz me on this",
  "Give me an example",
  "TL;DR",
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Props {
  threadId: string;
}

export function LearnChat({ threadId }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: initialMessages, isLoading: loadingMsgs } = useAiThreadMessages(threadId);
  const { data: threads = [] } = useAiThreads();
  const createThread = useCreateAiThread();
  const { awardSession, awardQuiz } = useLearnerProgress();
  const awardedRef = useRef(false);
  const [input, setInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [composerCollapsed, setComposerCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showJump, setShowJump] = useState(false);

  const activeThread = threads.find((t) => t.id === threadId);
  const threadTitle = activeThread?.title ?? "Apu — your tutor";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${SUPABASE_URL}/functions/v1/ai-tutor-chat`,
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token ?? "";
          return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
        },
        body: { threadId },
      }),
    [threadId],
  );

  const initial = useMemo<UIMessage[]>(() => {
    if (!initialMessages) return [];
    return initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
    })) as UIMessage[];
  }, [initialMessages]);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial,
    transport,
    onError: (e) => {
      const msg = (e as Error).message || "";
      if (msg.includes("429")) toast.error("Slow down a sec — try again in a moment.");
      else if (msg.includes("402"))
        toast.error("Out of tutoring credits for today. Try again tomorrow or top up in settings.");
      else toast.error("Something went off — let's try that again.");
    },
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJump(distanceFromBottom > 240);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (status !== "streaming") textareaRef.current?.focus();
  }, [status, threadId]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  useEffect(() => {
    if (status !== "ready" || awardedRef.current) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const text = (last.parts ?? [])
      .map((p: any) => (p.type === "text" ? p.text : ""))
      .join("");
    if (!text.trim()) return;
    awardedRef.current = true;
    const mcqHits = (text.match(/^\s*(?:[A-Da-d]|[\u0995-\u09BF])[\)\.\u0964]/gm) ?? []).length;
    if (mcqHits >= 3) awardQuiz();
    else awardSession();
  }, [status, messages, awardSession, awardQuiz]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSend = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    setInput("");
    sendMessage({ text: value });
  };

  const handleNewChat = async () => {
    const t = await createThread.mutateAsync();
    navigate(`/learn/${t.id}`);
  };

  const jumpToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const voiceComingSoon = () =>
    toast("Voice questions are on the way — text works great for now.");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <img src={tutorAvatar} alt="Apu, your ASIKON tutor" className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Hi, I'm Apu</h2>
        <p className="text-muted-foreground mb-4">Sign in to start chatting with Apu.</p>
        <a href="/auth"><Button>Sign in</Button></a>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-background">
      {/* Brand-tinted glass header */}
      <div className="lg:hidden shrink-0 relative flex items-center gap-2 px-3 py-1.5 border-b border-border/60 backdrop-blur-xl bg-background/70">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden
        />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full"
              aria-label="Your chats"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-3 border-b border-border">
              <SheetTitle>Your chats</SheetTitle>
            </SheetHeader>
            <ThreadList activeId={threadId} />
          </SheetContent>
        </Sheet>

        <button
          onClick={() => setSheetOpen(true)}
          aria-label="Switch chat"
          className="relative flex-1 mx-auto max-w-[60%] flex items-center justify-center gap-1.5 h-9 px-4 rounded-full border border-border/70 bg-card/60 hover:bg-card transition-colors"
        >
          <span className="text-sm font-medium truncate">{threadTitle}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
        </button>

        <Button
          onClick={handleNewChat}
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          disabled={createThread.isPending}
          aria-label="Start a new chat"
        >
          <PenSquare className="w-4 h-4" />
        </Button>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {loadingMsgs ? (
          <TranscriptSkeleton />
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState onPick={handleSend} />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-3 sm:py-4 space-y-5">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {status === "submitted" && <TypingIndicator />}
            <div className="h-1" />
          </div>
        )}
      </div>

      {/* Jump to latest pill */}
      {showJump && messages.length > 0 && (
        <button
          onClick={jumpToBottom}
          aria-label="Jump to latest reply"
          className="absolute left-1/2 -translate-x-1/2 bottom-32 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/90 backdrop-blur border border-border shadow-md hover:bg-card transition-colors animate-fade-in"
        >
          <ArrowDown className="w-3.5 h-3.5" /> Latest
        </button>
      )}

      {/* Composer — pinned flush against bottom nav */}
      <div className="shrink-0 relative px-3 pt-1.5 pb-1.5 border-t border-border/60 backdrop-blur-xl bg-background/85">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-3xl">
          {composerCollapsed ? (
            <button
              onClick={() => {
                setComposerCollapsed(false);
                setTimeout(() => textareaRef.current?.focus(), 0);
              }}
              className="w-full flex items-center justify-between gap-2 h-9 px-4 rounded-full border border-border bg-card/95 text-muted-foreground hover:text-foreground hover:bg-card transition-colors text-sm animate-fade-in"
              aria-label="Expand chat input"
            >
              <span className="truncate">Ask Apu a question</span>
              <ChevronUp className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <>
              {/* Action chips — append a real instruction to the next message */}
              {messages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1.5 -mx-1 px-1">
                  {ACTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setInput((v) => (v ? `${v} ${chip}` : chip));
                        textareaRef.current?.focus();
                      }}
                      className="shrink-0 px-3 py-1 rounded-full border border-border bg-card/80 hover:bg-card hover:border-primary/40 text-[11px] font-medium whitespace-nowrap transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Slim pill composer */}
              <div className="flex items-end gap-1 rounded-full border border-border bg-card shadow-[0_6px_24px_-12px_hsl(var(--primary)/0.45)] focus-within:border-primary/60 focus-within:shadow-[0_8px_28px_-10px_hsl(var(--primary)/0.6)] transition-all pl-1 pr-1 py-1">
                <Button
                  onClick={() => setComposerCollapsed(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Collapse chat input"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Ask Apu anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-[14px] leading-5 placeholder:text-muted-foreground/70 py-1.5 max-h-[120px]"
                  autoFocus
                />
                <Button
                  onClick={voiceComingSoon}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
                  aria-label="Voice input — coming soon"
                  title="Voice input — coming soon"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                {isBusy ? (
                  <Button
                    onClick={stop}
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full shrink-0"
                    aria-label="Stop reply"
                    title="Stop reply"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0 gradient-primary text-primary-foreground disabled:opacity-40 transition-transform active:scale-95 hover:shadow-[0_0_18px_-2px_hsl(var(--primary)/0.6)]"
                    aria-label="Send message"
                    title="Send"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TranscriptSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-4 space-y-5" aria-label="Loading conversation">
      <div className="flex justify-end">
        <div className="h-9 w-48 rounded-2xl rounded-br-md bg-primary/20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-[70%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[85%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[55%] rounded-md bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-[60%] rounded-md bg-muted animate-pulse" />
        <div className="h-3.5 w-[78%] rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in"
      aria-live="polite"
    >
      <span className="inline-flex items-end gap-1 h-4">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
      </span>
      Apu is thinking…
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-fade-in">
      <div className="flex flex-col items-center text-center mb-7">
        <div className="relative mb-4">
          <div
            className="absolute inset-0 -m-6 rounded-full blur-2xl opacity-60 animate-pulse"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden
          />
          <img
            src={tutorAvatar}
            alt="Apu, your ASIKON tutor"
            className="relative w-20 h-20 drop-shadow-[0_8px_24px_hsl(var(--primary)/0.45)]"
            width={512}
            height={512}
          />
        </div>
        <h1 className="text-2xl font-bold mb-1.5 text-gradient">Hi, I'm Apu</h1>
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
          Stuck on a chapter? Ask me anything — SSC, HSC, Math, Physics, English.
          I'll explain in English or Bangla, whichever helps.
        </p>
      </div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 mb-3 px-1">
        Not sure where to start?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_PROMPTS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.label}
              onClick={() => onPick(q.prompt)}
              className="group flex items-start gap-3 text-left p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-card/80 transition-all hover:-translate-y-0.5 pressable focus-ring"
            >
              <span
                className={cn(
                  "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                  q.tint,
                )}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium leading-snug pt-1">{q.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = (message.parts ?? [])
    .map((p: any) => (p.type === "text" ? p.text : ""))
    .join("");

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 bg-primary text-primary-foreground whitespace-pre-wrap text-[15px] leading-relaxed shadow-[0_4px_16px_-8px_hsl(var(--primary)/0.5)]">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "animate-fade-in text-foreground text-[15px] leading-relaxed",
        "prose prose-sm dark:prose-invert max-w-none break-words",
        "prose-p:my-2 prose-headings:mt-3 prose-headings:mb-1.5 prose-li:my-0.5",
        "prose-pre:my-2 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-xs prose-pre:bg-secondary/60",
        "prose-code:before:content-none prose-code:after:content-none prose-code:break-words",
        "prose-a:text-primary prose-a:break-all",
        "[&_table]:block [&_table]:overflow-x-auto [&_table]:text-xs [&_img]:rounded-lg",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          code: ({ className, children, ...props }: any) => {
            const inline = !className;
            return inline ? (
              <code className="px-1 py-0.5 rounded bg-muted text-foreground text-[0.85em]" {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text || "…"}
      </ReactMarkdown>
    </div>
  );
}
