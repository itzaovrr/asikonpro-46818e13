import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Lightweight client-side learner progress.
 * Tracks completed AI tutor sessions and MCQ quizzes per user via localStorage.
 * Used to award the "Learner" badge on the user's own profile.
 */
export interface LearnerProgress {
  sessions: number;
  quizzes: number;
  earnedBadge: boolean;
  lastUpdated: string | null;
}

const EMPTY: LearnerProgress = { sessions: 0, quizzes: 0, earnedBadge: false, lastUpdated: null };

const keyFor = (uid?: string) => (uid ? `asikon:learner-progress:${uid}` : null);

function read(uid?: string): LearnerProgress {
  const k = keyFor(uid);
  if (!k || typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(k);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(uid: string, p: LearnerProgress) {
  const k = keyFor(uid);
  if (!k) return;
  window.localStorage.setItem(k, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("learner-progress-updated", { detail: { uid } }));
}

export function useLearnerProgress(targetUserId?: string) {
  const { user } = useAuth();
  const uid = targetUserId ?? user?.id;
  const [progress, setProgress] = useState<LearnerProgress>(() => read(uid));

  useEffect(() => {
    setProgress(read(uid));
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as { uid?: string } | undefined;
      if (!detail?.uid || detail.uid === uid) setProgress(read(uid));
    };
    window.addEventListener("learner-progress-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("learner-progress-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [uid]);

  const awardSession = useCallback(() => {
    if (!user?.id) return;
    const cur = read(user.id);
    const next: LearnerProgress = {
      ...cur,
      sessions: cur.sessions + 1,
      earnedBadge: true,
      lastUpdated: new Date().toISOString(),
    };
    write(user.id, next);
  }, [user?.id]);

  const awardQuiz = useCallback(() => {
    if (!user?.id) return;
    const cur = read(user.id);
    const next: LearnerProgress = {
      ...cur,
      quizzes: cur.quizzes + 1,
      earnedBadge: true,
      lastUpdated: new Date().toISOString(),
    };
    write(user.id, next);
  }, [user?.id]);

  return { progress, awardSession, awardQuiz };
}
