-- =============================================
-- 🎯 AYITI TALENTS - SETUP COMPLET SUPABASE
-- =============================================
-- Exécutez ce script dans Supabase SQL Editor
-- =============================================

-- 1. TABLE: Candidatures (inscriptions)
CREATE TABLE IF NOT EXISTS candidate_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT,
  talents TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  showcase_file_url TEXT,
  payment_receipt_url TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE: Candidats actifs (après approbation)
CREATE TABLE IF NOT EXISTS contestants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  category TEXT,
  location TEXT,
  bio TEXT,
  talents TEXT[] DEFAULT '{}',
  video_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'eliminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE: Votes publics
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contestant_id UUID REFERENCES contestants(id) ON DELETE CASCADE,
  voter_id TEXT, -- fingerprint or session ID
  vote_type TEXT DEFAULT 'free' CHECK (vote_type IN ('free', 'paid')),
  amount_paid INTEGER DEFAULT 0,
  payment_reference TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE: Membres du Jury
CREATE TABLE IF NOT EXISTS jury_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  photo_url TEXT,
  specialty TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE: Votes du Jury
CREATE TABLE IF NOT EXISTS jury_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jury_member_id UUID REFERENCES jury_members(id) ON DELETE CASCADE,
  contestant_id UUID REFERENCES contestants(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  comments TEXT,
  criteria_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(jury_member_id, contestant_id)
);

-- 6. TABLE: Contenu (news, flyers, videos)
CREATE TABLE IF NOT EXISTS contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('news', 'flyer', 'video')),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLE: Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  tier TEXT DEFAULT 'silver' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLE: Paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACTIVER RLS (Row Level Security)
-- =============================================

ALTER TABLE candidate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jury_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jury_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES (Permissions)
-- =============================================

-- Candidate Applications
CREATE POLICY "Anyone can insert applications" ON candidate_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view applications" ON candidate_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can update applications" ON candidate_applications FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete applications" ON candidate_applications FOR DELETE USING (true);

-- Contestants
CREATE POLICY "Anyone can view contestants" ON contestants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contestants" ON contestants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contestants" ON contestants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contestants" ON contestants FOR DELETE USING (true);

-- Votes
CREATE POLICY "Anyone can view votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON votes FOR INSERT WITH CHECK (true);

-- Jury Members
CREATE POLICY "Anyone can view jury" ON jury_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jury" ON jury_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update jury" ON jury_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete jury" ON jury_members FOR DELETE USING (true);

-- Jury Votes
CREATE POLICY "Anyone can view jury votes" ON jury_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jury votes" ON jury_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update jury votes" ON jury_votes FOR UPDATE USING (true);

-- Contents
CREATE POLICY "Anyone can view contents" ON contents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contents" ON contents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contents" ON contents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contents" ON contents FOR DELETE USING (true);

-- Sponsors
CREATE POLICY "Anyone can view sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sponsors" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sponsors" ON sponsors FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sponsors" ON sponsors FOR DELETE USING (true);

-- Site Settings
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert settings" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings" ON site_settings FOR UPDATE USING (true);

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Paramètres par défaut
INSERT INTO site_settings (key, value) VALUES
('moncash_number', '3208-4512'),
('natcash_number', '3208-4512'),
('vote_price', '150')
ON CONFLICT (key) DO NOTHING;

-- Membres du jury par défaut
INSERT INTO jury_members (name, email, password_hash, specialty) VALUES
('Jean-Marc Désinor', 'jury1@ayititalents.com', 'jury123', 'Musique'),
('Marie-Flore Saint-Jean', 'jury2@ayititalents.com', 'jury123', 'Danse'),
('Patrick Sylvain', 'jury3@ayititalents.com', 'jury123', 'Chant')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Créez ces buckets manuellement dans Supabase > Storage:
-- 1. candidate-files (public)
-- 2. content-files (public)
-- 3. sponsor-logos (public)

-- =============================================
-- ✅ SETUP TERMINÉ!
-- =============================================


