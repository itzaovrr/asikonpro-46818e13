import { useMemo, useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAiThreadMessages } from "@/hooks/useAiTutor";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QUICK_PROMPTS = [
  { label: "SSC গণিত বুঝাও", prompt: "আমি SSC এর গণিতে দুর্বল। কোথায় থেকে শুরু করবো?" },
  { label: "Photosynthesis MCQ", prompt: "Make 5 MCQ on photosynthesis with answers and explanations." },
  { label: "Newton's 2nd law", prompt: "ভাই নিউটনের ২য় সূত্র সহজ করে বুঝাইয়া দাও।" },
  { label: "Study routine", prompt: "HSC পরীক্ষার জন্য একটা realistic ৭ দিনের revision routine বানাও।" },
  { label: "Motivate me", prompt: "আমি ফেল করবো মনে হচ্ছে। কিছু বলো।" },
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

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${SUPABASE_URL}/functions/v1/ai-tutor-chat`,
        headers: () => ({
          Authorization: `Bearer ${session?.access_token ?? ""}`,
          "Content-Type": "application/json",
        }),
        body: { threadId },
      }),
    [threadId, session?.access_token],
  );

  const initial = useMemo<UIMessage[]>(() => {
    if (!initialMessages) return [];
    return initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
    })) as UIMessage[];
  }, [initialMessages]);

  const { messages, sendMessage, status, error } = useChat({
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (status !== "streaming") textareaRef.current?.focus();
  }, [status, threadId]);

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
    // Detect MCQ-style replies (≥3 lettered options) → award a quiz instead.
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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Sparkles className="w-12 h-12 text-primary mb-3" />
        <h2 className="text-xl font-semibold mb-2">ASIKON AI Tutor</h2>
        <p className="text-muted-foreground mb-4">সাইন ইন করো তোমার AI শিক্ষকের সাথে কথা বলতে।</p>
        <a href="/auth"><Button>Sign in</Button></a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
        {loadingMsgs ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : messages.length === 0 ? (
          <EmptyState onPick={handleSend} />
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>চিন্তা করছি...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur-md p-3 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <Textarea
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
            className="min-h-[44px] max-h-32 resize-none"
            autoFocus
          />
          <Button onClick={() => handleSend(input)} disabled={!input.trim() || isBusy} size="icon" className="h-11 w-11 flex-shrink-0">
            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-8 px-2">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass mb-4">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-1 text-gradient">তোমার AI শিক্ষক</h1>
      <p className="text-muted-foreground text-sm mb-6">SSC, HSC, Math, Physics, English — যেকোনো প্রশ্ন করো। Bangla ও English দুটোতেই উত্তর দিবো।</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            onClick={() => onPick(q.prompt)}
            className="px-3 py-2 rounded-full text-sm bg-secondary/60 hover:bg-secondary text-foreground border border-border transition"
          >
            {q.label}
          </button>
        ))}
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
        <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 bg-primary text-primary-foreground whitespace-pre-wrap text-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[92%] sm:max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-secondary/60 border border-border/50",
          "prose prose-sm dark:prose-invert max-w-none break-words",
          "prose-p:my-1.5 prose-headings:mt-2.5 prose-headings:mb-1 prose-li:my-0.5",
          "prose-pre:my-2 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-xs",
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
                <code className={className} {...props}>{children}</code>
              );
            },
          }}
        >
          {text || "..."}
        </ReactMarkdown>
      </div>
    </div>
  );
}
