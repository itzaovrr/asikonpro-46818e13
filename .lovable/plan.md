
## Goal
Refine the AI Tutor (Learn) page so it feels on-brand (dark red gradient + liquid glass), every UI control has a clear purpose, and the copy sounds like a warm human tutor — not a robotic AI.

## Scope (frontend only)
File: `src/components/learn/LearnChat.tsx` (+ small tweak to `src/pages/Learn.tsx` for the signed-out hero).

## Changes

### 1. Brand visual pass
- Replace the neutral header with a slim liquid-glass bar tinted by `--gradient-primary` (dark red) at low opacity, with a subtle bottom hairline.
- Composer pill: upgrade `shadow-[…primary/0.35]` to a soft glow ring that intensifies on focus; add a 1px gradient border using brand red on focus-within instead of a flat primary border.
- Send button: keep `gradient-primary`, add a gentle scale + glow on hover, and a quick shimmer on successful send.
- Empty-state hero: layered radial brand-red glow behind the tutor avatar, gradient headline, refined quick-prompt cards with brand-tinted icon chips (one tint per category, not all primary).

### 2. Meaningful icons & buttons (audit pass)
Every control gets a single, documented purpose — remove decoration:
- `PanelLeft` → opens thread list (kept, labelled "Your chats").
- Title pill `ChevronDown` → opens thread list too (currently does); add `aria-label="Switch chat"`.
- `PenSquare` → new chat (kept, labelled).
- `Minus` minimize → renamed intent to `ChevronDown` (down = collapse) for visual consistency with the expand `ChevronUp`. The lone `Minus` reads as "remove" and is misleading.
- `Mic` → voice input. Until it's wired, show a tooltip "Voice input — coming soon" instead of a silent toast, and visually dim it so users know it's not active yet.
- Thinking dot: today it's a single pulsing dot with no meaning. Replace with 3 sequenced dots = "tutor is typing" (a recognized convention), plus the label "Apu is thinking…".
- Jump-to-latest pill: keep, but only show after the user has scrolled up >1 screen (already close to this) and add `aria-label`.

### 3. Loading & micro-animations
- Initial messages load: replace the bare `Loader2` with three skeleton message bubbles (one user, two assistant) using `animate-pulse` — communicates "loading conversation", not "loading something".
- Streaming: animated 3-dot typing indicator (staggered bounce via existing tailwind keyframes).
- Message entry: each new message fades+slides in (`animate-fade-in`, already in the design system).
- Send button: 150ms scale tap feedback.
- Avatar in empty state: slow brand-red glow pulse (2.5s) to feel alive without being noisy.

### 4. Copy pass — human, not robotic
Rewrite all user-facing strings to sound like a Bangladeshi tutor named **Apu** (the existing tutor persona on the avatar). No "AI", "bot", or "assistant" wording in the UI surface.

| Where | Before | After |
|---|---|---|
| Header default title | "ASIKON Tutor" | "Apu — your tutor" |
| Empty hero H1 | "Your AI Tutor" | "Hi, I'm Apu" |
| Empty hero sub | "SSC, HSC, Math… Answers in both English and Bangla." | "Stuck on a chapter? Ask me anything — SSC, HSC, Math, Physics, English. I'll explain in English or Bangla, whichever helps." |
| Quick-prompts label | "Try one of these" | "Not sure where to start?" |
| Quick prompt: Motivate me | "I feel like I'm going to fail. Say something to motivate me." | "I'm losing confidence before exams. Help me get back on track." |
| Placeholder | "Ask your question..." | "Ask Apu anything…" |
| Submitted state | "Thinking..." | "Apu is thinking…" |
| Minimized pill | "Tap to ask..." | "Ask Apu a question" |
| Stop tooltip | (none) | "Stop reply" |
| Toast 429 | "Too many requests — please try again in a moment." | "Slow down a sec — try again in a moment." |
| Toast 402 | "AI credits exhausted…" | "Out of tutoring credits for today. Try again tomorrow or top up in settings." |
| Generic error | raw message | "Something went off — let's try that again." |
| Coming-soon toast | "Coming soon" | "Voice questions are on the way — text works great for now." |
| Signed-out (Learn.tsx) | "Sign in to chat with your AI tutor." | "Sign in to start chatting with Apu." |

### 5. Action chips — purposeful set
Today's chips are generic. Replace with 5 chips that map to real tutor behaviors and are appended as instructions to the next message:
- "Explain like I'm 12"
- "In Bangla please"
- "Quiz me on this"
- "Give me an example"
- "TL;DR"

## Out of scope
- Backend / edge function changes
- Voice input wiring (kept as visible-but-disabled affordance)
- Thread list redesign

## Acceptance
- No raw `text-white`, `bg-black`, or hex colors introduced — only semantic tokens / gradient utilities already in `index.css`.
- Every button has an `aria-label` and a single clear purpose.
- All visible strings match the table above.
- Skeleton loader visible on first open of a thread with messages; typing indicator visible while streaming.
