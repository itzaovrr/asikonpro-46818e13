-- Reward redemptions table
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_key TEXT NOT NULL,
  coins_spent INTEGER NOT NULL CHECK (coins_spent > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions"
ON public.reward_redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users create own redemptions"
ON public.reward_redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all redemptions"
ON public.reward_redemptions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_reward_redemptions_user ON public.reward_redemptions(user_id, created_at DESC);

-- Atomic redeem function (bypasses profile column-protection trigger via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_key TEXT, _coins INTEGER)
RETURNS public.reward_redemptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  current_balance INTEGER;
  result public.reward_redemptions;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _coins IS NULL OR _coins <= 0 THEN RAISE EXCEPTION 'Invalid coin amount'; END IF;
  IF _reward_key IS NULL OR length(_reward_key) = 0 THEN RAISE EXCEPTION 'Invalid reward'; END IF;

  SELECT coins INTO current_balance FROM public.profiles WHERE id = uid FOR UPDATE;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF current_balance < _coins THEN RAISE EXCEPTION 'Insufficient coins'; END IF;

  UPDATE public.profiles SET coins = coins - _coins WHERE id = uid;

  INSERT INTO public.reward_redemptions (user_id, reward_key, coins_spent)
    VALUES (uid, _reward_key, _coins)
    RETURNING * INTO result;

  RETURN result;
END;
$$;