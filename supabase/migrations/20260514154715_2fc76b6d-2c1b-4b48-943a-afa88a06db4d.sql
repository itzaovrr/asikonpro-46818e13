-- ============ TRACKS ============
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tracks viewable by all" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Admins manage tracks" ON public.tracks FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));
CREATE TRIGGER tracks_updated_at BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LESSONS ============
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  outcome TEXT,
  duration_min INTEGER NOT NULL DEFAULT 5,
  content_md TEXT,
  video_url TEXT,
  transcript TEXT,
  pdf_url TEXT,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lessons_track_order ON public.lessons(track_id, "order");
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Preview lessons viewable by all" ON public.lessons FOR SELECT USING (is_preview = true);
CREATE POLICY "Authenticated view all lessons" ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LEARNER PROFILES ============
CREATE TABLE public.learner_profiles (
  user_id UUID PRIMARY KEY,
  goal TEXT,
  level TEXT,
  interests TEXT[] DEFAULT '{}',
  learning_style TEXT,
  active_track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  onboarded_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  streak_days INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own learner profile" ON public.learner_profiles FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read learner profiles" ON public.learner_profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));
CREATE TRIGGER learner_profiles_updated_at BEFORE UPDATE ON public.learner_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LESSON COMPLETIONS ============
CREATE TABLE public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  xp_awarded INTEGER NOT NULL DEFAULT 10,
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX idx_lesson_completions_user ON public.lesson_completions(user_id);
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own completions" ON public.lesson_completions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read completions" ON public.lesson_completions FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

-- ============ DAILY MISSIONS ============
CREATE TABLE public.daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own missions" ON public.daily_missions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ MILESTONES ============
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind)
);
CREATE INDEX idx_milestones_user ON public.milestones(user_id);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own milestones" ON public.milestones FOR SELECT
  USING (auth.uid() = user_id);

-- ============ STREAK + XP + MILESTONE TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_lesson_completion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  prev_active DATE;
  current_streak INTEGER;
  new_streak INTEGER;
  active_tr UUID;
  total_in_track INTEGER;
  done_in_track INTEGER;
BEGIN
  -- Ensure learner_profile row exists
  INSERT INTO public.learner_profiles (user_id) VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;

  SELECT last_active_at::date, streak_days, active_track_id
    INTO prev_active, current_streak, active_tr
    FROM public.learner_profiles WHERE user_id = NEW.user_id;

  IF prev_active = CURRENT_DATE THEN
    new_streak := COALESCE(current_streak, 1);
  ELSIF prev_active = CURRENT_DATE - 1 THEN
    new_streak := COALESCE(current_streak, 0) + 1;
  ELSE
    new_streak := 1;
  END IF;

  UPDATE public.learner_profiles
    SET streak_days = new_streak,
        last_active_at = now(),
        xp = xp + COALESCE(NEW.xp_awarded, 10)
    WHERE user_id = NEW.user_id;

  -- Mark today's mission complete if it matches
  UPDATE public.daily_missions
    SET completed = true
    WHERE user_id = NEW.user_id AND date = CURRENT_DATE AND lesson_id = NEW.lesson_id;

  -- First lesson milestone
  INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'first_lesson')
    ON CONFLICT DO NOTHING;

  -- Streak milestone
  IF new_streak >= 7 THEN
    INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'streak_7')
      ON CONFLICT DO NOTHING;
  END IF;
  IF new_streak >= 30 THEN
    INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'streak_30')
      ON CONFLICT DO NOTHING;
  END IF;

  -- Track complete
  IF active_tr IS NOT NULL THEN
    SELECT COUNT(*) INTO total_in_track FROM public.lessons WHERE track_id = active_tr;
    SELECT COUNT(*) INTO done_in_track
      FROM public.lesson_completions lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      WHERE lc.user_id = NEW.user_id AND l.track_id = active_tr;
    IF total_in_track > 0 AND done_in_track >= total_in_track THEN
      INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'track_complete')
        ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_lesson_completion AFTER INSERT ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.handle_lesson_completion();

-- ============ DAILY MISSION RPC ============
CREATE OR REPLACE FUNCTION public.get_or_create_today_mission()
RETURNS TABLE (id UUID, lesson_id UUID, date DATE, completed BOOLEAN)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  existing public.daily_missions%ROWTYPE;
  active_tr UUID;
  next_lesson UUID;
BEGIN
  IF uid IS NULL THEN RETURN; END IF;

  SELECT * INTO existing FROM public.daily_missions
    WHERE user_id = uid AND date = CURRENT_DATE LIMIT 1;
  IF FOUND THEN
    id := existing.id; lesson_id := existing.lesson_id;
    date := existing.date; completed := existing.completed;
    RETURN NEXT; RETURN;
  END IF;

  SELECT active_track_id INTO active_tr FROM public.learner_profiles WHERE user_id = uid;
  IF active_tr IS NULL THEN
    SELECT t.id INTO active_tr FROM public.tracks t
      WHERE t.is_active = true ORDER BY t.display_order LIMIT 1;
  END IF;

  SELECT l.id INTO next_lesson FROM public.lessons l
    WHERE l.track_id = active_tr
      AND l.id NOT IN (SELECT lc.lesson_id FROM public.lesson_completions lc WHERE lc.user_id = uid)
    ORDER BY l."order" ASC LIMIT 1;

  IF next_lesson IS NULL THEN RETURN; END IF;

  INSERT INTO public.daily_missions (user_id, date, lesson_id)
    VALUES (uid, CURRENT_DATE, next_lesson)
    RETURNING daily_missions.id, daily_missions.lesson_id, daily_missions.date, daily_missions.completed
    INTO id, lesson_id, date, completed;
  RETURN NEXT;
END; $$;

-- ============ SEED TRACKS + LESSONS ============
WITH t AS (
  INSERT INTO public.tracks (slug, name, description, icon, display_order) VALUES
    ('smart-student','Smart Student','Study smarter with AI — notes, summaries, routines, MCQs.','GraduationCap',1),
    ('ai-content-creator','AI Content Creator','Use AI to create posts, scripts, thumbnails and short videos.','Sparkles',2),
    ('ai-productivity','AI Productivity','Automate daily tasks and 10x your personal productivity.','Rocket',3),
    ('ai-design-basics','AI Design Basics','Design posters, logos and social graphics with AI tools.','Palette',4)
  RETURNING id, slug
)
INSERT INTO public.lessons (track_id, "order", title, outcome, duration_min, is_preview)
SELECT t.id, v.ord, v.title, v.outcome, v.dur, v.preview FROM t JOIN (VALUES
  -- Smart Student
  ('smart-student',1,'Welcome to Smart Student','See how AI can save you 10+ study hours every week.',5,true),
  ('smart-student',2,'Turn any chapter into clean notes','Convert long PDFs into 1-page revision notes.',8,false),
  ('smart-student',3,'Build a 30-min daily study routine','Get a focused routine you will actually follow.',6,false),
  ('smart-student',4,'Auto-generate MCQs for any topic','Practice exam-style questions in seconds.',7,false),
  ('smart-student',5,'Explain hard topics in simple language','Use AI as a private tutor for tough chapters.',6,false),
  -- AI Content Creator
  ('ai-content-creator',1,'Welcome to AI Content Creator','Map the modern creator workflow with AI.',5,true),
  ('ai-content-creator',2,'Write a week of social posts in 20 minutes','Batch-create captions for 7 days.',10,false),
  ('ai-content-creator',3,'Script a 60-second short','Hook, value, CTA — every time.',8,false),
  ('ai-content-creator',4,'Generate thumbnails that get clicks','Use AI image tools for high-CTR thumbs.',9,false),
  ('ai-content-creator',5,'Plan a content calendar','Stay consistent without burning out.',7,false),
  -- AI Productivity
  ('ai-productivity',1,'Welcome to AI Productivity','See where AI can replace busywork in your day.',5,true),
  ('ai-productivity',2,'Inbox Zero with AI','Triage, summarise and reply to email faster.',8,false),
  ('ai-productivity',3,'Plan your week with AI','Turn a brain-dump into a clear weekly plan.',6,false),
  ('ai-productivity',4,'Take meeting notes automatically','Capture and summarise meetings hands-free.',7,false),
  ('ai-productivity',5,'Build your personal AI assistant','Set up reusable prompts you use daily.',9,false),
  -- AI Design Basics
  ('ai-design-basics',1,'Welcome to AI Design','What AI can and cannot design (yet).',5,true),
  ('ai-design-basics',2,'Make a Facebook poster in 5 minutes','Generate, edit, export — fast.',8,false),
  ('ai-design-basics',3,'Design a clean logo with AI','Iterate on a brand mark you actually like.',10,false),
  ('ai-design-basics',4,'Create branded social templates','Reusable templates for posts and stories.',9,false),
  ('ai-design-basics',5,'Polish AI images like a designer','Crop, color and type tips that lift quality.',7,false)
) AS v(slug, ord, title, outcome, dur, preview) ON v.slug = t.slug;