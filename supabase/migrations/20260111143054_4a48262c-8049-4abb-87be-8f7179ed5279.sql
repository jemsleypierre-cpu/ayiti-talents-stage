-- =============================================
-- AUTHENTIFICATION SÉCURISÉE ADMIN ET JURY
-- =============================================

-- 1. Ajouter user_id à jury_members pour lier avec auth.users
ALTER TABLE jury_members 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Créer un index pour performance
CREATE INDEX IF NOT EXISTS idx_jury_members_user_id ON jury_members(user_id);

-- 3. Fonction pour vérifier si un utilisateur est membre du jury
CREATE OR REPLACE FUNCTION public.is_jury_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jury_members
    WHERE user_id = _user_id AND active = true
  )
$$;

-- 4. Fonction pour obtenir l'ID du membre jury à partir de l'auth user
CREATE OR REPLACE FUNCTION public.get_jury_member_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.jury_members
  WHERE user_id = _user_id AND active = true
  LIMIT 1
$$;

-- 5. Mettre à jour la politique RLS pour jury_votes
DROP POLICY IF EXISTS "Admins can manage all jury votes" ON jury_votes;

-- Les membres du jury peuvent gérer LEURS votes uniquement
CREATE POLICY "Jury can manage own votes" ON jury_votes
  FOR ALL USING (
    jury_member_id = public.get_jury_member_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- 6. Mettre à jour la validation des votes pour vérifier l'auth
CREATE OR REPLACE FUNCTION validate_jury_vote()
RETURNS TRIGGER AS $$
DECLARE
  auth_jury_member_id UUID;
BEGIN
  -- Récupérer l'ID du membre jury authentifié
  auth_jury_member_id := public.get_jury_member_id(auth.uid());
  
  -- Vérifier que l'utilisateur est bien le membre du jury
  IF auth_jury_member_id IS NULL THEN
    -- Permettre aux admins de gérer les votes
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Vous devez être authentifié en tant que membre du jury';
    END IF;
  ELSE
    -- Forcer le jury_member_id à être celui de l'utilisateur authentifié
    NEW.jury_member_id := auth_jury_member_id;
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
    IF NOT (
      NEW.criteria_scores ? 'technique' AND
      NEW.criteria_scores ? 'creativity' AND
      NEW.criteria_scores ? 'stage_presence' AND
      NEW.criteria_scores ? 'originality'
    ) THEN
      RAISE EXCEPTION 'Critères manquants dans criteria_scores';
    END IF;
    
    IF (NEW.criteria_scores->>'technique')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'creativity')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'stage_presence')::numeric NOT BETWEEN 1 AND 10
      OR (NEW.criteria_scores->>'originality')::numeric NOT BETWEEN 1 AND 10 THEN
      RAISE EXCEPTION 'Les notes doivent être entre 1 et 10';
    END IF;
    
    NEW.score := ROUND(
      (
        (NEW.criteria_scores->>'technique')::numeric +
        (NEW.criteria_scores->>'creativity')::numeric +
        (NEW.criteria_scores->>'stage_presence')::numeric +
        (NEW.criteria_scores->>'originality')::numeric
      ) / 4.0
    );
  ELSE
    IF NEW.score NOT BETWEEN 1 AND 10 THEN
      RAISE EXCEPTION 'Le score doit être entre 1 et 10';
    END IF;
  END IF;
  
  IF LENGTH(COALESCE(NEW.comments, '')) > 1000 THEN
    RAISE EXCEPTION 'Les commentaires ne doivent pas dépasser 1000 caractères';
  END IF;
  
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;