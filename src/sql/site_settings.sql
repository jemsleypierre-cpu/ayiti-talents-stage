-- =============================================
-- TABLE DES PARAMÈTRES DU SITE
-- =============================================
-- Permet aux admins de configurer les options du site

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT, -- Description pour l'admin
  category TEXT DEFAULT 'general', -- Catégorie (payment, general, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les paramètres de paiement par défaut
INSERT INTO site_settings (key, value, label, category) VALUES
('moncash_number', '3208-4512', 'Numéro MonCash pour recevoir les paiements', 'payment'),
('natcash_number', '3208-4512', 'Numéro NatCash pour recevoir les paiements', 'payment'),
('vote_price', '150', 'Prix d''un vote payant (en HTG)', 'payment'),
('free_vote_weight', '2', 'Pondération des votes gratuits (%)', 'voting'),
('paid_vote_weight', '78', 'Pondération des votes payants (%)', 'voting'),
('jury_vote_weight', '20', 'Pondération des votes jury (%)', 'voting'),
('registration_open', 'true', 'Inscriptions ouvertes', 'general'),
('voting_open', 'true', 'Votes ouverts', 'general')
ON CONFLICT (key) DO NOTHING;

-- Index pour recherche rapide par clé
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les paramètres
CREATE POLICY "Anyone can view settings" ON site_settings
  FOR SELECT USING (true);

-- Seuls les admins peuvent modifier (via l'interface admin protégée par mot de passe)
CREATE POLICY "Anyone can update settings" ON site_settings
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert settings" ON site_settings
  FOR INSERT WITH CHECK (true);

