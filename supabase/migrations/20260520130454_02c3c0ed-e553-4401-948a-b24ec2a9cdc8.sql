
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY,
  profile_visibility text NOT NULL DEFAULT 'public',
  show_online_status boolean NOT NULL DEFAULT true,
  allow_messages_from text NOT NULL DEFAULT 'everyone',
  show_orders_to_followers boolean NOT NULL DEFAULT false,
  notify_orders boolean NOT NULL DEFAULT true,
  notify_promotions boolean NOT NULL DEFAULT true,
  notify_community boolean NOT NULL DEFAULT true,
  notify_messages boolean NOT NULL DEFAULT true,
  notify_follows boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_visibility_check CHECK (profile_visibility IN ('public','followers','private')),
  CONSTRAINT user_settings_messages_check CHECK (allow_messages_from IN ('everyone','followers','none'))
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Backfill for existing users
INSERT INTO public.user_settings (user_id)
  SELECT id FROM auth.users
  ON CONFLICT (user_id) DO NOTHING;

-- Extend handle_new_user to seed defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, coins)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    100
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_settings (user_id) VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  IF NEW.email = 'emysan.ceo@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Enable realtime for user_followers
ALTER TABLE public.user_followers REPLICA IDENTITY FULL;
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_followers;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
