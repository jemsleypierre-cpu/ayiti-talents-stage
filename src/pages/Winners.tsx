import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Crown, Medal, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Winner {
  id: string;
  name: string;
  year: number;
  category: string;
  position: 1 | 2 | 3;
  photo?: string;
  testimonial?: string;
  prize: string;
}

const pastWinners: Winner[] = [
  {
    id: '1',
    name: 'À venir...',
    year: 2025,
    category: 'Chant',
    position: 1,
    prize: '30,000 Gourdes',
    testimonial: 'Les gagnants de l\'édition 2025 seront annoncés bientôt!'
  }
];

export const Winners: React.FC = () => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-7 w-7 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-500" />;
      default:
        return <Star className="h-6 w-6 text-primary" />;
    }
  };

  const getPositionLabel = (position: number) => {
    switch (position) {
      case 1:
        return '🥇 1ère Place';
      case 2:
        return '🥈 2ème Place';
      case 3:
        return '🥉 3ème Place';
      default:
        return 'Finaliste';
    }
  };

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300';
      case 3:
        return 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen gradient-teal py-8 px-4 pt-48">
      <div className="container mx-auto max-w-6xl">
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nos Gagnants 🏆
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Découvrez les talents exceptionnels qui ont brillé lors des éditions précédentes
            </p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <Card className="white-card mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <Trophy className="h-16 w-16 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Première Édition en Cours!
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Les gagnants de la première édition de Rayon des Jeunes Talents seront 
              annoncés à la fin du concours. Inscrivez-vous maintenant pour avoir 
              votre chance de figurer parmi eux!
            </p>
            <Button asChild className="mt-6 bg-white text-primary hover:bg-white/90 font-bold px-8 py-3 rounded-full">
              <Link to="/register">
                S'inscrire au concours
              </Link>
            </Button>
          </div>
        </Card>

        {/* Future Winners Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((position) => (
            <Card 
              key={position} 
              className={`border-2 ${getPositionStyle(position as 1 | 2 | 3)} overflow-hidden`}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {getPositionIcon(position)}
                </div>
                <Badge className="mb-4 bg-primary/10 text-primary">
                  {getPositionLabel(position)}
                </Badge>
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">?</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  À déterminer
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Le gagnant sera annoncé à la fin du concours
                </p>
                <div className="bg-gray-100 rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {position === 1 && '30,000 Gourdes + Trophée'}
                    {position === 2 && '15,000 Gourdes + Trophée'}
                    {position === 3 && 'Prix spécial + Trophée'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What Winners Get */}
        <Card className="white-card">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Ce que nos gagnants reçoivent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Prix en Espèces</h3>
                <p className="text-sm text-gray-600">Jusqu'à 30,000 Gourdes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trophée Officiel</h3>
                <p className="text-sm text-gray-600">Un symbole de votre talent</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📢</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reconnaissance</h3>
                <p className="text-sm text-gray-600">Sur toutes nos plateformes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Opportunités</h3>
                <p className="text-sm text-gray-600">Connexions professionnelles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

