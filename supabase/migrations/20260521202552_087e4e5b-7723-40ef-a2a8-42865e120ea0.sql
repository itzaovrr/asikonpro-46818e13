-- Banner kind enum
DO $$ BEGIN
  CREATE TYPE public.home_banner_kind AS ENUM ('hero', 'offer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Table
CREATE TABLE IF NOT EXISTS public.home_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind public.home_banner_kind NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.home_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active banners viewable by all"
  ON public.home_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage banners"
  ON public.home_banners FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_home_banners_updated_at
  BEFORE UPDATE ON public.home_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_home_banners_kind_active_order
  ON public.home_banners (kind, is_active, display_order);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-banners', 'home-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Home banner images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'home-banners');

CREATE POLICY "Admins upload home banner images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'home-banners'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins update home banner images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'home-banners'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins delete home banner images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'home-banners'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );