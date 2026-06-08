
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Site content (flexible key/value text blocks for editable page copy)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Staff
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.staff TO anon, authenticated;
GRANT ALL ON public.staff TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.staff TO authenticated;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_staff_updated BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Gallery
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_images TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- News
CREATE TABLE public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_posts TO anon, authenticated;
GRANT ALL ON public.news_posts TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published news" ON public.news_posts FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage news" ON public.news_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default content
INSERT INTO public.site_content (key, value) VALUES
  ('home.hero.eyebrow', 'Bomas Academy · Jos, Plateau State'),
  ('home.hero.title', 'Where character meets excellence.'),
  ('home.hero.subtitle', 'A nurturing learning community shaping confident, curious, and compassionate young minds in the heart of Jos.'),
  ('home.intro.title', 'A school built on faith, discipline and discovery.'),
  ('home.intro.body', 'For over a decade, Bomas Academy has guided students from early years through senior secondary with a balanced curriculum, dedicated educators, and a campus designed to inspire wonder.'),
  ('home.stats.students', '600+'),
  ('home.stats.teachers', '45'),
  ('home.stats.years', '15'),
  ('about.title', 'About Bomas Academy'),
  ('about.mission', 'To raise a generation of thinkers, leaders and creators rooted in strong values and prepared for a global future.'),
  ('about.vision', 'To be the school of first choice in Plateau State — celebrated for academic depth, character and creativity.'),
  ('about.story', 'Founded in Jos with a small classroom and a big vision, Bomas Academy has grown into a full primary and secondary institution. We blend the Nigerian curriculum with international standards, music, sports, ICT and faith-based mentorship.'),
  ('academics.title', 'Academics'),
  ('academics.intro', 'From early years to senior secondary, we deliver a curriculum that challenges, supports and stretches every learner.'),
  ('academics.early.title', 'Early Years'),
  ('academics.early.body', 'Play-based learning, phonics, numeracy and the joy of discovery — ages 2 to 5.'),
  ('academics.primary.title', 'Primary School'),
  ('academics.primary.body', 'Strong literacy, numeracy, science and creative arts foundations — Primary 1 to 6.'),
  ('academics.secondary.title', 'Secondary School'),
  ('academics.secondary.body', 'JSS and SSS streams preparing students for WAEC, NECO and university — with mentorship and career guidance.'),
  ('admissions.title', 'Admissions'),
  ('admissions.intro', 'We welcome families who share our commitment to character, learning and community.'),
  ('admissions.steps', '1. Submit an enquiry form\n2. Schedule a campus visit\n3. Sit for an entrance assessment\n4. Receive an admission decision\n5. Enrol and prepare for resumption'),
  ('admissions.cta', 'Apply for the 2026/2027 session'),
  ('contact.address', 'Bomas Academy, Jos, Plateau State, Nigeria'),
  ('contact.phone', '+234 800 000 0000'),
  ('contact.email', 'info@bomasacademy.ng'),
  ('contact.hours', 'Mon – Fri · 7:30am – 4:00pm');
