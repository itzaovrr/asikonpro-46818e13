## Goal
Rework the mobile `/learn/:threadId` experience so it feels like Lovable's mobile chat: clean transcript (no assistant bubbles), large rounded composer with inline send, a friendly empty state, smooth streaming/thinking states, and a slide‑in thread drawer. Bottom nav stays visible (already shipped).

## Reference shape (Lovable mobile)
- No in‑page chat sub‑header. The only top chrome is the global app header.
- Assistant text: no bubble, no border — markdown rendered directly on the chat surface in normal foreground color.
- User messages: right‑aligned filled pill using `primary / primary-foreground` (high contrast).
- Composer: one tall rounded card pinned above the bottom nav. Textarea grows up to ~6 lines. Send is an icon button anchored inside the bottom‑right of the composer, not a separate column.
- Empty state: agent avatar + short headline + 3–4 suggestion cards stacked full‑width.
- Streaming: shimmer "Thinking…" line in place of the next assistant message.
- Scroll: sticky‑to‑bottom with a small "scroll to latest" pill that appears when the user scrolls up.
- Thread switcher: hamburger in the composer/header opens a left sheet with thread list + "New chat". No persistent sub‑header.

## Install AI Elements (per chat‑agent contract)
Use the AI Elements primitives we don't already have. One command:

```
bun x ai-elements@latest add conversation message prompt-input shimmer
```

If the CLI prompts to overwrite existing shadcn primitives, answer no. We will compose around the installed components and keep our existing `Button`, `Sheet`, `Textarea`, etc.

## Files to change

1. **`src/components/learn/LearnChat.tsx`** (rewrite, same exports/props)
   - Replace the hand‑rolled scroller with `<Conversation><ConversationContent>…</ConversationContent><ConversationScrollButton /></Conversation>`.
   - Replace `MessageRow` with AI Elements `<Message from={role}><MessageContent>…</MessageContent></Message>`:
     - Assistant: render with `<MessageResponse>` (streamed markdown, no background). Remove the `bg-secondary/60` bubble + border classes.
     - User: keep a compact filled pill using `bg-primary text-primary-foreground` via `MessageContent` variants.
   - Replace the composer block with `<PromptInput onSubmit={…}>` containing `<PromptInputTextarea autoFocus placeholder="…" />` and a `<PromptInputFooter className="justify-end"><PromptInputSubmit status={status} disabled={!input.trim() || isBusy} /></PromptInputFooter>`.
   - Use `<Shimmer>চিন্তা করছি…</Shimmer>` when `status === "submitted"` instead of the spinner row.
   - Empty state: bigger greeting card. Use a generated `asikon-tutor-avatar.png` (premium quality, transparent PNG) instead of the generic `Sparkles` icon as the agent identity mark. Suggestions become full‑width tap cards in a 1‑col mobile / 2‑col `sm:` grid.
   - Keep all existing AI SDK wiring: `useChat({ id: threadId, messages: initial, transport })`, the `awardSession/awardQuiz` effect, error toasts, and the focus‑on‑ready effect.

2. **`src/pages/Learn.tsx`**
   - Drop the in‑page header strip (the `Sparkles + "ASIKON AI Tutor"` bar). On mobile the global `MobileHeader` is enough; on desktop keep the left sidebar with `ThreadList`.
   - Move the `ThreadListSheet` trigger into the new `LearnChat` (small hamburger inside the empty state and as a left‑inset action on the composer) so the chat area uses the full viewport.
   - Height stays `h-[calc(100dvh - var(--app-header-h,56px) - 64px)]` on mobile so the composer sits flush above the bottom nav.

3. **`src/assets/asikon-tutor-avatar.png`** (new, generated)
   - Premium image gen: small friendly mascot/logo mark consistent with the dark‑red brand gradient, transparent background. Used as the empty‑state avatar and as the assistant avatar slot (small circle next to streaming messages is optional).

4. **`src/index.css`** (tiny additions only if needed)
   - If AI Elements `prose` styles need toning down for the mobile width, add a single scoped override under `.learn-prose` (no global changes).

## Out of scope
- No changes to the Supabase edge function, message persistence, awards, or thread CRUD.
- No restyle of the global mobile header, bottom nav, or other pages.
- No new dependencies beyond the AI Elements registry components above.

## Verification (mobile 393×800)
- Open `/learn` from bottom nav → empty state shows avatar, headline, 4 suggestion cards.
- Tap a suggestion → message sends, "চিন্তা করছি…" shimmer appears, assistant streams as plain markdown text (no bubble), composer textarea regains focus.
- Send a long reply → transcript scrolls; scroll up → "scroll to latest" pill appears.
- Hamburger inside composer → left sheet opens with threads + "New chat". Create new thread → URL changes to `/learn/<id>`, transcript resets, composer focused.
- Bottom nav remains visible the whole time; composer sits exactly above it; no content hidden under nav.
- Reload `/learn/<id>` → messages restore from `useAiThreadMessages` and render in the new style.
- Desktop ≥1024: sidebar thread list + chat unchanged structurally; only the message/composer styling updates.
