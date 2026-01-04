-- =============================================
-- SCHÉMA COMPLET POUR LE CONCOURS DE TALENTS
-- =============================================

-- 1. TABLE DES PROFILS UTILISATEURS
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. TABLE DES RÔLES UTILISATEURS (sécurisée)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'jury');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction sécurisée pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 3. TABLE DES CANDIDATS/CONTESTANTS
CREATE TABLE public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  category TEXT,
  location TEXT,
  bio TEXT,
  photo_url TEXT,
  talents TEXT[],
  social_media JSONB,
  status TEXT DEFAULT 'active',
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active contestants" ON public.contestants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage contestants" ON public.contestants
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. TABLE DES CANDIDATURES
CREATE TABLE public.candidate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  age INTEGER,
  category TEXT,
  location TEXT,
  bio TEXT,
  photo_url TEXT,
  showcase_file_url TEXT,
  payment_receipt_url TEXT,
  talents TEXT[],
  social_media JSONB,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.candidate_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all applications" ON public.candidate_applications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit application" ON public.candidate_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update applications" ON public.candidate_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- 5. TABLE DES VOTES
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contestant_id UUID REFERENCES public.contestants(id) ON DELETE CASCADE NOT NULL,
  voter_ip TEXT NOT NULL,
  voter_session TEXT,
  vote_type TEXT DEFAULT 'free',
  amount_paid NUMERIC,
  payment_reference TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can vote" ON public.votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

-- 6. TABLE DES MEMBRES DU JURY
CREATE TABLE public.jury_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  photo_url TEXT,
  specialty TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.jury_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jury members" ON public.jury_members
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage jury" ON public.jury_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. TABLE DES VOTES DU JURY
CREATE TABLE public.jury_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jury_member_id UUID REFERENCES public.jury_members(id) ON DELETE CASCADE NOT NULL,
  contestant_id UUID REFERENCES public.contestants(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  comments TEXT,
  criteria_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(jury_member_id, contestant_id)
);

ALTER TABLE public.jury_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jury can manage their votes" ON public.jury_votes
  FOR ALL USING (true);

-- 8. TABLE DES ACTUALITÉS
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news" ON public.news
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. TABLE DES ORGANISATEURS
CREATE TABLE public.organisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  order_display INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.organisateurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active organisers" ON public.organisateurs
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage organisers" ON public.organisateurs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 10. TABLE DES VIDÉOS DE PERFORMANCE
CREATE TABLE public.performance_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  file_size INTEGER,
  file_format TEXT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.performance_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos" ON public.performance_videos
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can upload their own videos" ON public.performance_videos
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own videos" ON public.performance_videos
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all videos" ON public.performance_videos
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 11. TABLE DES PARAMÈTRES DU SITE
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insérer les paramètres par défaut
INSERT INTO public.site_settings (key, value, label, category) VALUES
  ('moncash_number', '3208-4512', 'Numéro MonCash', 'payment'),
  ('natcash_number', '3208-4512', 'Numéro NatCash', 'payment'),
  ('vote_price', '150', 'Prix d''un vote (HTG)', 'payment'),
  ('registration_open', 'true', 'Inscriptions ouvertes', 'general'),
  ('voting_open', 'true', 'Votes ouverts', 'general');

-- 12. TRIGGER POUR CRÉER UN PROFIL À L'INSCRIPTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. TRIGGER POUR METTRE À JOUR updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contestants_updated_at BEFORE UPDATE ON public.contestants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidate_applications_updated_at BEFORE UPDATE ON public.candidate_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();