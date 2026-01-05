-- =============================================
-- SCRIPT POUR CRÉER LES COMPTES ADMIN
-- =============================================
-- Ce script ajoute le rôle admin aux utilisateurs spécifiés
-- Les utilisateurs doivent d'abord créer leur compte via /auth

-- ÉTAPE 1: Les admins doivent d'abord s'inscrire avec ces emails:
-- - zoe1@ayititalents.com (mot de passe: Zoe2106)
-- - zoe2@ayititalents.com (mot de passe: Zoe2106)
-- - zoe3@ayititalents.com (mot de passe: Zoe2106)

-- ÉTAPE 2: Après inscription, exécuter ce script pour leur donner le rôle admin

-- Ajouter le rôle admin aux utilisateurs
-- (Remplacer les emails si différents)

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email IN ('zoe1@ayititalents.com', 'zoe2@ayititalents.com', 'zoe3@ayititalents.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Vérifier les admins créés
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
