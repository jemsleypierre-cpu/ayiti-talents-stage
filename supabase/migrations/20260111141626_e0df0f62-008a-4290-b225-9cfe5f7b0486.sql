-- =============================================
-- CORRECTION DES 6 ERREURS DE SÉCURITÉ
-- =============================================

-- 1. JURY_MEMBERS: Restreindre l'accès aux données sensibles (password_hash, email)
-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Anyone can view active jury members" ON jury_members;

-- Créer une vue publique sans données sensibles
CREATE OR REPLACE VIEW public.jury_members_public AS
SELECT id, name, photo_url, specialty, bio, active
FROM jury_members
WHERE active = true;

-- Nouvelle politique: seuls les admins peuvent voir toutes les données
CREATE POLICY "Only admins can view full jury data" ON jury_members
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. CANDIDATE_APPLICATIONS: Restreindre l'accès aux données personnelles
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can view applications" ON candidate_applications;

-- Les admins peuvent tout voir (déjà existant, on vérifie)
-- La politique "Admins can view all applications" existe déjà

-- 3. JURY_VOTES: Restreindre la gestion aux propriétaires des votes
DROP POLICY IF EXISTS "Jury can manage their votes" ON jury_votes;

-- Politique: Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all jury votes" ON jury_votes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Politique: Lecture publique des votes (pour les résultats)
CREATE POLICY "Anyone can view jury votes" ON jury_votes
  FOR SELECT USING (true);

-- 4. VALIDATION SERVER-SIDE: Fonction de validation des votes jury
CREATE OR REPLACE FUNCTION validate_jury_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Valider que le jury_member_id existe et est actif
  IF NOT EXISTS (
    SELECT 1 FROM jury_members 
    WHERE id = NEW.jury_member_id AND active = true
  ) THEN
    RAISE EXCEPTION 'Membre du jury invalide ou inactif';
  END IF;
  
  -- Valider que le contestant_id existe et est actif
  IF NOT EXISTS (
    SELECT 1 FROM contestants 
    WHERE id = NEW.contestant_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Candidat invalide ou inactif';
  END IF;
  
  -- Valider la structure de criteria_scores si présent
  IF NEW.criteria_scores IS NOT NULL THEN
    -- Vérifier que les champs requis existent
    IF NOT (
      NEW.criteria_scores ? 'technique' AND
      NEW.criteria_scores ? 'creativity' AND
      NEW.criteria_scores ? 'stage_presence' AND
      NEW.criteria_scores ? 'originality'
    ) THEN
      RAISE EXCEPTION 'Critères manquants dans criteria_scores';
    END IF;
    
    -- Valider les valeurs (1-10)
    IF (NEW.criteria_scores->>'technique')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'creativity')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'stage_presence')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'originality')::numeric NOT BETWEEN 1 AND 10 THEN
      RAISE EXCEPTION 'Les notes doivent être entre 1 et 10';
    END IF;
    
    -- Recalculer le score côté serveur
    NEW.score := ROUND(
      (
        (NEW.criteria_scores->>'technique')::numeric +
        (NEW.criteria_scores->>'creativity')::numeric +
        (NEW.criteria_scores->>'stage_presence')::numeric +
        (NEW.criteria_scores->>'originality')::numeric
      ) / 4.0
    );
  ELSE
    -- Si pas de criteria_scores, valider que score est entre 1 et 10
    IF NEW.score NOT BETWEEN 1 AND 10 THEN
      RAISE EXCEPTION 'Le score doit être entre 1 et 10';
    END IF;
  END IF;
  
  -- Valider la longueur des commentaires (max 1000 caractères)
  IF LENGTH(COALESCE(NEW.comments, '')) > 1000 THEN
    RAISE EXCEPTION 'Les commentaires ne doivent pas dépasser 1000 caractères';
  END IF;
  
  -- Mettre à jour updated_at
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer le trigger de validation
DROP TRIGGER IF EXISTS validate_jury_vote_trigger ON jury_votes;
CREATE TRIGGER validate_jury_vote_trigger
  BEFORE INSERT OR UPDATE ON jury_votes
  FOR EACH ROW EXECUTE FUNCTION validate_jury_vote();

-- 5. Accorder l'accès à la vue publique
GRANT SELECT ON public.jury_members_public TO anon, authenticated;