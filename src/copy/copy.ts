/**
 * Centralized user-facing copy. Single source of truth for emotional positioning.
 * Phase 2 will translate this file into Bangla (bn) via react-i18next.
 *
 * Voice rules:
 *   - "You are improving" not "you are chasing money"
 *   - Calm, mature, never childish
 *   - Short sentences, 1 idea each
 */
export const copy = {
  brand: {
    name: "ASIKON",
    tagline: "Learn one small thing today.",
  },
  onboarding: {
    title: "Let's set up your learning",
    subtitle: "Three minutes now saves you weeks later.",
    steps: {
      goal: {
        title: "What do you want from learning?",
        subtitle: "We'll shape your daily mission around this.",
        options: [
          { value: "study_better", label: "Study smarter at school or college" },
          { value: "earn_skills", label: "Build skills for future work" },
          { value: "create_content", label: "Create content with AI" },
          { value: "personal_growth", label: "Grow as a person, one habit at a time" },
        ],
      },
      level: {
        title: "Where are you starting from?",
        subtitle: "Honest answer = better plan.",
        options: [
          { value: "absolute_beginner", label: "Absolute beginner" },
          { value: "some_basics", label: "I know some basics" },
          { value: "intermediate", label: "I can build small things" },
          { value: "advanced", label: "I want to go deeper" },
        ],
      },
      interests: {
        title: "Pick what excites you",
        subtitle: "Choose 1 or more.",
        options: [
          { value: "ai_tools", label: "AI tools" },
          { value: "writing", label: "Writing & content" },
          { value: "design", label: "Design & visuals" },
          { value: "productivity", label: "Productivity & habits" },
          { value: "study", label: "Study & exams" },
          { value: "freelance", label: "Freelance & income" },
        ],
      },
      style: {
        title: "How do you learn best?",
        subtitle: "We'll respect your time.",
        options: [
          { value: "short_daily", label: "Short, daily — 5–10 minutes" },
          { value: "weekend_deep", label: "Longer sessions on weekends" },
          { value: "video_first", label: "Video-first, light reading" },
          { value: "text_first", label: "Text & notes-first" },
        ],
      },
      track: {
        title: "Pick your starting track",
        subtitle: "You can switch any time.",
      },
    },
    finish: "Start my journey",
    skip: "I'll do this later",
  },
  mission: {
    eyebrow: "Today's mission",
    why: "Why this matters",
    duration: (m: number) => `${m} min`,
    cta: "Start the lesson",
    completedTitle: "Mission complete",
    completedSubtitle: "You showed up today. That's the whole game.",
    emptyTitle: "All caught up",
    emptySubtitle: "You've finished every lesson in this track. Pick a new one when you're ready.",
    needsTrackTitle: "Choose a track to begin",
    needsTrackSubtitle: "We'll pick one focused thing for you each day.",
  },
  progress: {
    streakLabel: "day streak",
    streakNew: "Start your streak today",
    xpLabel: "XP",
    nextMilestone: "Next milestone",
    journey: "Your skill journey",
  },
  lesson: {
    backToTrack: "Back to track",
    markComplete: "Mark as complete",
    completed: "Completed",
    outcomeLabel: "What you'll get",
  },
  empty: {
    noTracks: "No tracks yet. Check back soon.",
  },
} as const;
