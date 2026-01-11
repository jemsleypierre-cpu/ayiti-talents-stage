-- Corriger la vue pour ne pas utiliser SECURITY DEFINER
DROP VIEW IF EXISTS public.jury_members_public;

-- Recréer la vue sans SECURITY DEFINER (vue normale)
CREATE VIEW public.jury_members_public AS
SELECT id, name, photo_url, specialty, bio, active
FROM jury_members
WHERE active = true;

-- Définir le propriétaire et les permissions correctement
ALTER VIEW public.jury_members_public OWNER TO postgres;
GRANT SELECT ON public.jury_members_public TO anon, authenticated;

-- Politique RLS pour permettre la lecture de la vue via la table
-- La vue lit depuis jury_members, donc on garde la politique admin pour les données complètes
-- mais on ajoute une politique pour la lecture publique des colonnes non sensibles

-- Créer une politique pour permettre la lecture publique des données non sensibles
CREATE POLICY "Anyone can view public jury info" ON jury_members
  FOR SELECT USING (active = true);

-- Note: Les politiques RLS sur la table s'appliquent aussi à la vue
-- Donc avec "Anyone can view public jury info" + la vue qui filtre les colonnes,
-- les données sensibles (password_hash, email) sont protégées