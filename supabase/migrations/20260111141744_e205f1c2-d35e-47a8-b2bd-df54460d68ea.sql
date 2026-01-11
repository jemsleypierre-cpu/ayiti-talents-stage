-- Supprimer la vue problématique
DROP VIEW IF EXISTS public.jury_members_public CASCADE;

-- Approche alternative: utiliser directement la table avec RLS
-- La politique "Anyone can view public jury info" permet déjà la lecture
-- Le code frontend doit sélectionner seulement les colonnes non sensibles