import { useMemo, useState } from "react";
import { Search, Copy, Check, Wand2, Sparkles, Code2, GraduationCap, Briefcase, PenTool, Megaphone, Brain } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Prompt = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  uses?: number;
};

const categories = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "learning", label: "Learning", icon: GraduationCap },
  { key: "coding", label: "Coding", icon: Code2 },
  { key: "writing", label: "Writing", icon: PenTool },
  { key: "career", label: "Career", icon: Briefcase },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "thinking", label: "Thinking", icon: Brain },
];

const PROMPTS: Prompt[] = [
  {
    id: "p1",
    title: "Explain like I'm a beginner",
    category: "learning",
    tags: ["study", "ELI5"],
    body: "You are a patient tutor. Explain {{topic}} as if I'm a complete beginner. Use a simple real-world analogy, then give 3 key points, then a 1-line summary.",
    uses: 1284,
  },
  {
    id: "p2",
    title: "Spaced-repetition study plan",
    category: "learning",
    tags: ["plan", "memory"],
    body: "Create a 14-day spaced-repetition study plan for {{topic}}. For each day list: warm-up review, new material, active recall question, and a 5-minute reflection prompt.",
    uses: 932,
  },
  {
    id: "p3",
    title: "Debug my code step by step",
    category: "coding",
    tags: ["debug", "review"],
    body: "Act as a senior engineer. Here is my code:\n\n```\n{{code}}\n```\n\nWalk through it line by line, identify bugs, suggest a fix, and rewrite the corrected version with comments.",
    uses: 2105,
  },
  {
    id: "p4",
    title: "Convert idea to PRD",
    category: "career",
    tags: ["product", "PRD"],
    body: "Turn this idea into a concise Product Requirements Doc: {{idea}}.\nInclude: problem, target user, goals, non-goals, key features, success metrics, and risks.",
    uses: 612,
  },
  {
    id: "p5",
    title: "Rewrite for clarity",
    category: "writing",
    tags: ["edit", "clarity"],
    body: "Rewrite the following text for clarity and concision without losing meaning. Keep the original tone:\n\n{{text}}",
    uses: 1810,
  },
  {
    id: "p6",
    title: "Cold outreach email",
    category: "marketing",
    tags: ["email", "sales"],
    body: "Write a 90-word cold email to {{persona}} about {{offer}}. Open with a specific observation, propose one concrete value, end with a soft single-question CTA.",
    uses: 745,
  },
  {
    id: "p7",
    title: "Mental model: First principles",
    category: "thinking",
    tags: ["framework"],
    body: "Apply first-principles thinking to {{problem}}. Break it into fundamental truths, list assumptions you're rejecting, then build a fresh solution from the ground up.",
    uses: 521,
  },
  {
    id: "p8",
    title: "Interview prep — STAR answers",
    category: "career",
    tags: ["interview"],
    body: "Generate 5 likely behavioral questions for a {{role}} role. For each, give a STAR-format answer using this experience: {{experience}}.",
    uses: 488,
  },
  {
    id: "p9",
    title: "Generate unit tests",
    category: "coding",
    tags: ["testing"],
    body: "Write thorough unit tests for the function below. Cover happy path, edge cases, and failure modes. Use {{framework}}.\n\n```\n{{code}}\n```",
    uses: 1399,
  },
  {
    id: "p10",
    title: "Viral hook ideas",
    category: "marketing",
    tags: ["social", "hooks"],
    body: "Give me 10 scroll-stopping hooks for a short-form video about {{topic}}. Mix curiosity, contrast, and bold claims. Keep each under 12 words.",
    uses: 967,
  },
  {
    id: "p11",
    title: "Summarize a long article",
    category: "writing",
    tags: ["summary"],
    body: "Summarize this in 3 layers: (1) one sentence, (2) five bullet points, (3) a 150-word recap with the author's strongest argument:\n\n{{text}}",
    uses: 1620,
  },
  {
    id: "p12",
    title: "Concept quiz generator",
    category: "learning",
    tags: ["quiz"],
    body: "Make a 10-question quiz on {{topic}}: 6 MCQs, 3 short-answer, 1 scenario question. Provide an answer key with brief explanations.",
    uses: 803,
  },
];

const Prompts = () => {
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMPTS.filter((p) => {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeCat, query]);

  const handleCopy = async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.body);
      setCopiedId(p.id);
      toast({ title: "Prompt copied", description: p.title });
      setTimeout(() => setCopiedId((id) => (id === p.id ? null : id)), 1600);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-3 pb-24 space-y-6 pb-10">
        {/* Hero */}
        <Reveal as="section">
          <div
            className="relative overflow-hidden rounded-2xl border border-primary/20 p-5 sm:p-7"
            style={{ background: "var(--gradient-primary-soft)" }}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)] shrink-0">
                <Wand2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Prompt Library
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  1000+ curated AI prompts to learn faster, code smarter, and create better. Tap any card to copy.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Search */}
        <section>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, tags, or keywords…"
              className="pl-9 h-11 rounded-xl"
              aria-label="Search prompts"
            />
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCat(c.key)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-all pressable focus-ring",
                    active
                      ? "gradient-primary text-primary-foreground border-transparent shadow-[var(--shadow-glow)]"
                      : "bg-card hover:bg-secondary border-border/60 text-foreground"
                  )}
                  aria-pressed={active}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results header */}
        <SectionHeader
          title={activeCat === "all" ? "All prompts" : categories.find((c) => c.key === activeCat)?.label + " prompts"}
          subtitle={`${filtered.length} prompt${filtered.length === 1 ? "" : "s"}`}
        />

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            No prompts match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => {
              const copied = copiedId === p.id;
              return (
                <Reveal key={p.id} delay={Math.min(i, 6) * 40}>
                  <article className="group relative h-full flex flex-col rounded-2xl border border-border/60 bg-card hover-lift overflow-hidden">
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base leading-snug pr-2">
                          {p.title}
                        </h3>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider shrink-0">
                          {p.category}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap font-mono leading-relaxed">
                        {p.body}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-background/40">
                      <span className="text-[11px] text-muted-foreground">
                        {p.uses?.toLocaleString() ?? 0} uses
                      </span>
                      <Button
                        size="sm"
                        variant={copied ? "secondary" : "premium"}
                        onClick={() => handleCopy(p)}
                        className="h-8 gap-1.5"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Prompts;
