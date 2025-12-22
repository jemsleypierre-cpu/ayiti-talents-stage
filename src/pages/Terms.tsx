import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
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
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Conditions d'Utilisation 📜
            </h1>
            <p className="text-white/80">
              Dernière mise à jour: Décembre 2025
            </p>
          </div>
        </div>

        <Card className="white-card">
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
            <p className="text-gray-600 mb-6">
              En accédant et en utilisant le site Rayon des Jeunes Talents, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Éligibilité au Concours</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Le concours est ouvert à tous les talents haïtiens</li>
              <li>Les participants doivent fournir des informations exactes lors de l'inscription</li>
              <li>Les frais d'inscription de 1000 Gourdes sont non remboursables</li>
              <li>Chaque participant ne peut soumettre qu'une seule candidature</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contenu Soumis</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">Important</p>
                  <p className="text-yellow-700 text-sm">
                    Tout contenu inapproprié, offensant, ou violant les droits d'auteur sera rejeté et pourrait entraîner la disqualification du participant.
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Les vidéos doivent être appropriées pour tous les âges</li>
              <li>Vous devez détenir tous les droits sur le contenu soumis</li>
              <li>Rayon des Jeunes Talents se réserve le droit d'utiliser les vidéos à des fins promotionnelles</li>
              <li>Le contenu ne doit pas contenir de musique protégée par des droits d'auteur sans autorisation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Système de Vote</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Chaque utilisateur peut voter une fois par jour</li>
              <li>Toute tentative de manipulation des votes entraînera une disqualification</li>
              <li>Les résultats du vote sont combinés avec l'évaluation du jury</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prix et Récompenses</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Prix garantis</p>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• 1ère Place: 30,000 Gourdes + Trophée</li>
                    <li>• 2ème Place: 15,000 Gourdes + Trophée</li>
                    <li>• 3ème Place: Prix à déterminer + Trophée</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modification des Conditions</h2>
            <p className="text-gray-600 mb-6">
              Rayon des Jeunes Talents se réserve le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication sur le site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions, contactez-nous à{' '}
              <a href="mailto:rayondesjeunetalents@gmail.com" className="text-primary hover:underline">
                rayondesjeunetalents@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

