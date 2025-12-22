import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle,
  Circle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'inscription' | 'voting' | 'selection' | 'finale' | 'announcement';
}

const events: Event[] = [
  {
    id: '1',
    title: 'Ouverture des Inscriptions',
    date: '1 Janvier 2026',
    description: 'Début de la période d\'inscription pour tous les candidats.',
    status: 'current',
    type: 'inscription'
  },
  {
    id: '2',
    title: 'Clôture des Inscriptions',
    date: '31 Mars 2026',
    time: '23:59',
    description: 'Dernière chance pour soumettre votre candidature.',
    status: 'upcoming',
    type: 'inscription'
  },
  {
    id: '3',
    title: 'Début des Votes du Public',
    date: '1 Avril 2026',
    description: 'Le public peut commencer à voter pour leurs candidats préférés.',
    status: 'upcoming',
    type: 'voting'
  },
  {
    id: '4',
    title: 'Sélection des Finalistes',
    date: '15 Avril 2026',
    description: 'Annonce des 20 finalistes sélectionnés par le jury.',
    status: 'upcoming',
    type: 'selection'
  },
  {
    id: '5',
    title: 'Clôture des Votes',
    date: '30 Avril 2026',
    time: '23:59',
    description: 'Dernière chance pour voter pour votre candidat préféré.',
    status: 'upcoming',
    type: 'voting'
  },
  {
    id: '6',
    title: 'Grande Finale',
    date: '15 Mai 2026',
    time: '18:00',
    location: 'À annoncer',
    description: 'Événement final avec performances live des finalistes.',
    status: 'upcoming',
    type: 'finale'
  },
  {
    id: '7',
    title: 'Annonce des Gagnants',
    date: '15 Mai 2026',
    time: '21:00',
    description: 'Révélation des gagnants et remise des prix.',
    status: 'upcoming',
    type: 'announcement'
  }
];

export const Calendar: React.FC = () => {
  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'current':
        return <div className="h-6 w-6 rounded-full bg-primary animate-pulse" />;
      case 'upcoming':
        return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'inscription':
        return 'bg-blue-100 text-blue-800';
      case 'voting':
        return 'bg-purple-100 text-purple-800';
      case 'selection':
        return 'bg-yellow-100 text-yellow-800';
      case 'finale':
        return 'bg-red-100 text-red-800';
      case 'announcement':
        return 'bg-green-100 text-green-800';
    }
  };

  const getTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'inscription':
        return 'Inscription';
      case 'voting':
        return 'Vote';
      case 'selection':
        return 'Sélection';
      case 'finale':
        return 'Finale';
      case 'announcement':
        return 'Annonce';
    }
  };

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
                <CalendarIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Calendrier du Concours 📅
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Toutes les dates importantes à retenir pour ne rien manquer
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/30 md:left-1/2 md:-translate-x-1/2" />

          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <div 
                key={event.id}
                className={`relative flex items-start gap-4 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 z-10">
                  {getStatusIcon(event.status)}
                </div>

                {/* Content Card */}
                <Card className={`white-card ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                  event.status === 'current' ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getTypeColor(event.type)}>
                        {getTypeLabel(event.type)}
                      </Badge>
                      {event.status === 'current' && (
                        <Badge className="bg-primary text-white animate-pulse">
                          En cours
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>

                    {event.status === 'current' && event.type === 'inscription' && (
                      <Button asChild className="w-full mt-4 gradient-cta text-gray-900 font-bold rounded-xl">
                        <Link to="/register">
                          S'inscrire maintenant
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Add to Calendar CTA */}
        <Card className="white-card mt-12">
          <CardContent className="p-6 text-center">
            <CalendarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ne manquez aucune date!
            </h3>
            <p className="text-gray-600 mb-4">
              Inscrivez-vous à notre newsletter pour recevoir des rappels
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="gradient-cta text-gray-900 font-bold px-6 rounded-xl">
                S'abonner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

