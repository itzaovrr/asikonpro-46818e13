import { useMemo, useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Loader2, Square, ArrowDown, BookOpen, Brain, ListChecks, Sparkles as SparklesIcon, Heart } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAiThreadMessages } from "@/hooks/useAiTutor";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import tutorAvatar from "@/assets/asikon-tutor-avatar.png";

const QUICK_PROMPTS = [
  { icon: BookOpen, label: "SSC গণিত বুঝাও", prompt: "আমি SSC এর গণিতে দুর্বল। কোথায় থেকে শুরু করবো?" },
  { icon: ListChecks, label: "Photosynthesis MCQ", prompt: "Make 5 MCQ on photosynthesis with answers and explanations." },
  { icon: Brain, label: "Newton's 2nd law", prompt: "ভাই নিউটনের ২য় সূত্র সহজ করে বুঝাইয়া দাও।" },
  { icon: SparklesIcon, label: "Study routine", prompt: "HSC পরীক্ষার জন্য একটা realistic ৭ দিনের revision routine বানাও।" },
  { icon: Heart, label: "Motivate me", prompt: "আমি ফেল করবো মনে হচ্ছে। কিছু বলো।" },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Props {
  threadId: string;
}

export function LearnChat({ threadId }: Props) {
  const { user, session } = useAuth();
  const { data: initialMessages, isLoading: loadingMsgs } = useAiThreadMessages(threadId);
  const { awardSession, awardQuiz } = useLearnerProgress();
  const awardedRef = useRef(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showJump, setShowJump] = useState(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${SUPABASE_URL}/functions/v1/ai-tutor-chat`,
        // Read the freshest token at request time to avoid sending an empty Bearer
        // when the session loads after the transport was first created.
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
      const msg = (e as Error).message || "Something went wrong";
      if (msg.includes("429")) toast.error("একটু পরে আবার চেষ্টা করো — অনেক request হয়ে গেছে।");
      else if (msg.includes("402")) toast.error("AI credits শেষ। Workspace settings এ গিয়ে credits যোগ করো।");
      else toast.error(msg);
    },
  });

  // Auto-scroll to bottom on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Track scroll position to show "jump to latest" pill
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

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [input]);

  // Award learner progress when an assistant reply finishes for the first time this mount.
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

  const jumpToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <img src={tutorAvatar} alt="ASIKON AI Tutor" className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">ASIKON AI Tutor</h2>
        <p className="text-muted-foreground mb-4">সাইন ইন করো তোমার AI শিক্ষকের সাথে কথা বলতে।</p>
        <a href="/auth"><Button>Sign in</Button></a>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {loadingMsgs ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState onPick={handleSend} />
        ) : (
          <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 py-4 space-y-5">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                চিন্তা করছি...
              </div>
            )}
            <div className="h-2" />
          </div>
        )}
      </div>

      {/* Jump to latest pill */}
      {showJump && messages.length > 0 && (
        <button
          onClick={jumpToBottom}
          className="absolute left-1/2 -translate-x-1/2 bottom-[110px] z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/90 backdrop-blur border border-border shadow-md hover:bg-secondary"
        >
          <ArrowDown className="w-3.5 h-3.5" /> Latest
        </button>
      )}

      {/* Composer */}
      <div className="shrink-0 px-3 pt-2 pb-3 bg-gradient-to-t from-background via-background to-background/60">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative rounded-3xl border border-border bg-card shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.15)] focus-within:border-primary/50 transition-colors">
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
              placeholder="তোমার প্রশ্ন লেখো... (Bangla, English বা Banglish)"
              rows={1}
              className="w-full resize-none bg-transparent outline-none text-[15px] leading-6 placeholder:text-muted-foreground/70 px-4 pt-3.5 pb-12 max-h-[180px]"
              autoFocus
            />
            <div className="absolute right-2 bottom-2">
              {isBusy ? (
                <Button onClick={stop} size="icon" variant="secondary" className="h-9 w-9 rounded-full">
                  <Square className="w-4 h-4 fill-current" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  size="icon"
                  className="h-9 w-9 rounded-full gradient-primary text-primary-foreground disabled:opacity-40 disabled:gradient-primary"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground/70 mt-1.5">
            AI mistakes ঘটতে পারে — important info verify করো।
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-10 pb-6">
      <div className="flex flex-col items-center text-center mb-7">
        <img
          src={tutorAvatar}
          alt="ASIKON AI Tutor"
          className="w-20 h-20 mb-4 drop-shadow-[0_8px_24px_hsl(var(--primary)/0.35)]"
          width={512}
          height={512}
        />
        <h1 className="text-2xl font-bold mb-1.5 text-gradient">তোমার AI শিক্ষক</h1>
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
          SSC, HSC, Math, Physics, English — যেকোনো প্রশ্ন করো। Bangla ও English দুটোতেই উত্তর দিবো।
        </p>
      </div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 mb-3 px-1">
        Try one of these
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_PROMPTS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.label}
              onClick={() => onPick(q.prompt)}
              className="group flex items-start gap-3 text-left p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-secondary/40 transition-colors pressable focus-ring"
            >
              <span className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 bg-primary text-primary-foreground whitespace-pre-wrap text-[15px] leading-relaxed">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "text-foreground text-[15px] leading-relaxed",
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
        {text || "..."}
      </ReactMarkdown>
    </div>
  );
}
