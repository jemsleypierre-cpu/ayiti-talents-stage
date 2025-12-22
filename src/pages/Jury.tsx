import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Award, Music, Palette, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JuryMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  photo?: string;
  bio: string;
  icon: React.ElementType;
}

const juryMembers: JuryMember[] = [
  {
    id: '1',
    name: 'À annoncer',
    role: 'Juge Principal',
    specialty: 'Musique',
    bio: 'Les membres du jury seront annoncés prochainement. Restez connectés!',
    icon: Music
  },
  {
    id: '2',
    name: 'À annoncer',
    role: 'Juge',
    specialty: 'Danse & Performance',
    bio: 'Expert en arts de la scène et chorégraphie.',
    icon: Star
  },
  {
    id: '3',
    name: 'À annoncer',
    role: 'Juge',
    specialty: 'Arts Visuels',
    bio: 'Spécialiste en dessin et arts plastiques.',
    icon: Palette
  },
  {
    id: '4',
    name: 'À annoncer',
    role: 'Juge',
    specialty: 'Poésie & Littérature',
    bio: 'Expert en expression orale et poésie.',
    icon: BookOpen
  }
];

const criteria = [
  { name: 'Originalité', percentage: 30, description: 'Créativité et unicité de la performance' },
  { name: 'Technique', percentage: 25, description: 'Maîtrise technique du talent présenté' },
  { name: 'Impact Émotionnel', percentage: 25, description: 'Capacité à toucher et captiver le public' },
  { name: 'Votes du Public', percentage: 20, description: 'Soutien de la communauté' },
];

export const Jury: React.FC = () => {
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
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notre Jury ⭐
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Rencontrez les experts qui évalueront les performances des candidats
            </p>
          </div>
        </div>

        {/* Jury Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {juryMembers.map((member) => {
            const Icon = member.icon;
            return (
              <Card key={member.id} className="white-card overflow-hidden card-hover">
                <div className="bg-gradient-to-br from-primary to-secondary h-20"></div>
                <CardContent className="-mt-10 pb-6 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <Badge className="mb-2 bg-primary/10 text-primary">
                    {member.specialty}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Evaluation Criteria */}
        <Card className="white-card mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Critères d'Évaluation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {criteria.map((criterion, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{criterion.name}</h3>
                    <Badge className="bg-primary text-white">
                      {criterion.percentage}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${criterion.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Join CTA */}
        <Card className="white-card bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à montrer votre talent?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Inscrivez-vous maintenant et laissez notre jury découvrir votre talent exceptionnel!
            </p>
            <Button asChild className="gradient-cta text-gray-900 font-bold px-8 py-3 rounded-full">
              <Link to="/register">
                S'inscrire au concours
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

