import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen gradient-teal py-8 px-4 pt-48">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 gap-2 text-white hover:bg-white/20 rounded-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Politique de Confidentialité 🔒
            </h1>
            <p className="text-white/80">
              Dernière mise à jour: Décembre 2025
            </p>
          </div>
        </div>

        <Card className="white-card">
          <CardContent className="p-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Données Sécurisées</h3>
                <p className="text-sm text-gray-600">Vos données sont protégées</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Transparence</h3>
                <p className="text-sm text-gray-600">Nous expliquons tout</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <Trash2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Droit à l'oubli</h3>
                <p className="text-sm text-gray-600">Supprimez vos données</p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Collecte des Données</h2>
              <p className="text-gray-600 mb-4">
                Nous collectons les informations que vous nous fournissez lors de votre inscription:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Nom complet</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Âge</li>
                <li>Ville de résidence</li>
                <li>Vidéos et photos de performance</li>
                <li>Reçu de paiement</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation des Données</h2>
              <p className="text-gray-600 mb-4">
                Vos données sont utilisées pour:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Gérer votre participation au concours</li>
                <li>Vous contacter concernant le concours</li>
                <li>Afficher votre profil sur la page des candidats</li>
                <li>Promouvoir le concours (avec votre consentement)</li>
                <li>Améliorer nos services</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Protection des Données</h2>
              <p className="text-gray-600 mb-6">
                Nous utilisons Supabase, une plateforme sécurisée, pour stocker vos données. 
                Toutes les communications sont chiffrées via HTTPS. Nous ne vendons jamais 
                vos données à des tiers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies</h2>
              <p className="text-gray-600 mb-6">
                Nous utilisons des cookies pour:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences de vote</li>
                <li>Améliorer votre expérience utilisateur</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos Droits</h2>
              <p className="text-gray-600 mb-4">
                Vous avez le droit de:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger vos informations</li>
                <li>Demander la suppression de vos données</li>
                <li>Retirer votre consentement à tout moment</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact</h2>
              <p className="text-gray-600">
                Pour toute question concernant vos données, contactez notre responsable 
                de la protection des données à{' '}
                <a href="mailto:rayondesjeunetalents@gmail.com" className="text-primary hover:underline">
                  rayondesjeunetalents@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

