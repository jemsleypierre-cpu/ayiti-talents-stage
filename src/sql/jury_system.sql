-- =============================================
-- SYSTÈME DE VOTE AVEC PONDÉRATION JURY
-- =============================================
-- Votes Jury (Performance): 49% du score total
-- Votes Payants (150 HTG): 49% du score total
-- Votes Gratuits: 2% du score total
-- =============================================

-- Table des membres du jury
CREATE TABLE IF NOT EXISTS jury_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Mot de passe hashé
  photo_url TEXT,
  specialty TEXT, -- Spécialité (Chant, Danse, Musique, etc.)
  bio TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des votes du jury
CREATE TABLE IF NOT EXISTS jury_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jury_member_id UUID REFERENCES jury_members(id) ON DELETE CASCADE,
  contestant_id UUID REFERENCES contestants(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10), -- Note de 1 à 10
  comments TEXT, -- Commentaires du jury
  criteria_scores JSONB, -- Notes par critère (technique, créativité, présence, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Un membre du jury ne peut voter qu'une fois par candidat
  UNIQUE(jury_member_id, contestant_id)
);

-- Mise à jour de la table votes pour distinguer gratuit/payant
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS vote_type TEXT DEFAULT 'free' CHECK (vote_type IN ('free', 'paid')),
ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Vue pour calculer les scores pondérés
CREATE OR REPLACE VIEW contestant_weighted_scores AS
SELECT 
  c.id,
  c.name,
  c.photo_url,
  c.category,
  c.location,
  -- Nombre de votes par type
  COALESCE(free_votes.count, 0) as free_votes_count,
  COALESCE(paid_votes.count, 0) as paid_votes_count,
  COALESCE(jury_scores.avg_score, 0) as jury_average_score,
  COALESCE(jury_scores.total_jury_votes, 0) as jury_votes_count,
  -- Scores pondérés (sur 100)
  ROUND(
    (COALESCE(jury_scores.avg_score, 0) * 10 * 0.49) + -- 49% jury (note sur 10 * 10 = sur 100)
    (LEAST(COALESCE(free_votes.count, 0) / 100.0, 1) * 100 * 0.02) + -- 2% votes gratuits (plafonné)
    (LEAST(COALESCE(paid_votes.count, 0) / 50.0, 1) * 100 * 0.49) -- 49% votes payants (plafonné)
  , 2) as weighted_score,
  -- Montant total collecté
  COALESCE(paid_votes.count, 0) * 150 as total_amount_htg
FROM contestants c
LEFT JOIN (
  SELECT contestant_id, COUNT(*) as count 
  FROM votes 
  WHERE vote_type = 'free' OR vote_type IS NULL
  GROUP BY contestant_id
) free_votes ON c.id = free_votes.contestant_id
LEFT JOIN (
  SELECT contestant_id, COUNT(*) as count 
  FROM votes 
  WHERE vote_type = 'paid'
  GROUP BY contestant_id
) paid_votes ON c.id = paid_votes.contestant_id
LEFT JOIN (
  SELECT 
    contestant_id, 
    AVG(score) as avg_score,
    COUNT(*) as total_jury_votes
  FROM jury_votes 
  GROUP BY contestant_id
) jury_scores ON c.id = jury_scores.contestant_id
WHERE c.status = 'active'
ORDER BY weighted_score DESC;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_jury_votes_contestant ON jury_votes(contestant_id);
CREATE INDEX IF NOT EXISTS idx_jury_votes_member ON jury_votes(jury_member_id);
CREATE INDEX IF NOT EXISTS idx_votes_type ON votes(vote_type);

-- Fonction pour calculer le score pondéré d'un candidat
CREATE OR REPLACE FUNCTION calculate_weighted_score(contestant_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  jury_score NUMERIC;
  free_count INTEGER;
  paid_count INTEGER;
  total_score NUMERIC;
BEGIN
  -- Score moyen du jury
  SELECT COALESCE(AVG(score), 0) INTO jury_score
  FROM jury_votes WHERE contestant_id = contestant_uuid;
  
  -- Comptage votes gratuits
  SELECT COALESCE(COUNT(*), 0) INTO free_count
  FROM votes WHERE contestant_id = contestant_uuid AND (vote_type = 'free' OR vote_type IS NULL);
  
  -- Comptage votes payants
  SELECT COALESCE(COUNT(*), 0) INTO paid_count
  FROM votes WHERE contestant_id = contestant_uuid AND vote_type = 'paid';
  
  -- Calcul du score pondéré (Jury et Payant égaux)
  total_score := (jury_score * 10 * 0.49) + -- 49% jury (performance)
                 (LEAST(free_count / 100.0, 1) * 100 * 0.02) + -- 2% gratuit
                 (LEAST(paid_count / 50.0, 1) * 100 * 0.49); -- 49% payant
  
  RETURN ROUND(total_score, 2);
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) pour jury_members
ALTER TABLE jury_members ENABLE ROW LEVEL SECURITY;

-- Les membres du jury peuvent voir leur propre profil
CREATE POLICY "Jury members can view own profile" ON jury_members
  FOR SELECT USING (true);

-- RLS pour jury_votes  
ALTER TABLE jury_votes ENABLE ROW LEVEL SECURITY;

-- Lecture publique des votes jury
CREATE POLICY "Anyone can view jury votes" ON jury_votes
  FOR SELECT USING (true);

-- Insérer quelques membres du jury de test
INSERT INTO jury_members (name, email, password_hash, specialty, bio) VALUES
('Jean-Marc Désinor', 'jury1@ayititalents.com', 'jury123', 'Musique', 'Musicien professionnel avec 20 ans d''expérience'),
('Marie-Flore Saint-Jean', 'jury2@ayititalents.com', 'jury123', 'Danse', 'Chorégraphe internationale reconnue'),
('Patrick Sylvain', 'jury3@ayititalents.com', 'jury123', 'Chant', 'Producteur et compositeur haïtien')
ON CONFLICT (email) DO NOTHING;

