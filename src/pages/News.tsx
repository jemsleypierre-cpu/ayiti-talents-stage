import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Calendar, Clock, Users, Award, Megaphone, ArrowRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'results' | 'finalist' | 'general';
  date: string;
  time: string;
  image?: string;
  important?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Phase Finale du Concours - Votes Ouverts!',
    content: 'La phase finale du Loveble Talent Contest a officiellement commencé! Les 20 finalistes ont été sélectionnés et les votes du public sont maintenant ouverts. Vous avez jusqu\'au 31 décembre pour voter pour votre candidat préféré.',
    category: 'announcement',
    date: '2024-01-15',
    time: '14:30',
    important: true
  },
  {
    id: '2',
    title: 'Nouveaux Candidats de la Semaine',
    content: '15 nouveaux talents exceptionnels ont rejoint la compétition cette semaine. Découvrez leurs performances incroyables dans les catégories chant, danse, et poésie. Ne manquez pas de voir leurs vidéos!',
    category: 'general',
    date: '2024-01-12',
    time: '10:15'
  },
  {
    id: '3',
    title: 'Résultats du Vote Populaire - Semaine 3',
    content: 'Les résultats de la troisième semaine sont arrivés! Marie-Claire Joseph maintient sa première place avec 1,247 votes, suivie de près par Mackenson Charles avec 1,105 votes. La compétition s\'intensifie!',
    category: 'results',
    date: '2024-01-10',
    time: '18:00'
  },
  {
    id: '4',
    title: 'Sélection des Finalistes - Critères Révélés',
    content: 'Découvrez comment nos juges sélectionnent les finalistes. Les critères incluent: originalité (30%), technique (25%), impact émotionnel (25%), et votes du public (20%). La transparence est notre priorité.',
    category: 'announcement',
    date: '2024-01-08',
    time: '16:45'
  },
  {
    id: '5',
    title: 'Performance Exceptionnelle - Jean-Baptiste Pierre',
    content: 'Le danseur de Cap-Haïtien a ébloui les juges avec sa fusion unique de konpa traditionnel et de hip-hop moderne. Sa vidéo a atteint 50,000 vues en seulement 3 jours!',
    category: 'finalist',
    date: '2024-01-05',
    time: '12:20'
  },
  {
    id: '6',
    title: 'Extension de la Période d\'inscription',
    content: 'Bonne nouvelle! Nous avons étendu la période d\'inscription jusqu\'au 20 janvier pour permettre à plus de jeunes talents de participer. N\'attendez plus pour vous inscrire!',
    category: 'announcement',
    date: '2024-01-03',
    time: '09:30'
  }
];

export const News: React.FC = () => {
  const { t } = useLanguage();

  const getCategoryInfo = (category: NewsItem['category']) => {
    switch (category) {
      case 'announcement':
        return { label: 'Annonce', color: 'bg-primary/10 text-primary border-primary/20', icon: Megaphone };
      case 'results':
        return { label: 'Résultats', color: 'bg-accent/10 text-accent border-accent/20', icon: Award };
      case 'finalist':
        return { label: 'Finaliste', color: 'bg-highlight/10 text-highlight border-highlight/20', icon: Users };
      case 'general':
        return { label: 'Général', color: 'bg-secondary/10 text-secondary border-secondary/20', icon: Calendar };
      default:
        return { label: 'Info', color: 'bg-muted/10 text-muted-foreground border-muted/20', icon: Calendar };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-48 bg-background">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('news.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Restez informés des dernières nouvelles, annonces et résultats du Loveble Talent Contest.
          </p>
        </div>

        {/* Important News Banner */}
        {newsItems.filter(item => item.important).map((item) => {
          const categoryInfo = getCategoryInfo(item.category);
          const Icon = categoryInfo.icon;
          
          return (
            <Card key={item.id} className="mb-8 bg-green-500 border-0 text-black shadow-talent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-black/20 text-black border-black/30">
                    <Icon className="w-3 h-3 mr-1" />
                    Important
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-black/80">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.date)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{item.time}</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-black font-bold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/90 mb-4 font-medium">{item.content}</p>
                <Button variant="outline" className="gap-2 bg-white text-black border-black hover:bg-black hover:text-white">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Regular News */}
        <div className="space-y-6">
          {newsItems.filter(item => !item.important).map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            const Icon = categoryInfo.icon;
            
            return (
              <Card key={item.id} className="bg-card/95 backdrop-blur-sm border-0 shadow-card hover:shadow-talent transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={categoryInfo.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {categoryInfo.label}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.content}</p>
                  <Button variant="ghost" size="sm" className="gap-2 hover:gap-3 transition-all">
                    Lire la suite
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="gap-2">
            Charger plus d'actualités
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Notification Signup */}
        <Card className="mt-12 bg-gradient-sunset border-0 text-white shadow-talent">
          <CardContent className="text-center py-8">
            <Megaphone className="mx-auto h-12 w-12 text-white mb-4" />
            <h3 className="text-xl font-bold mb-2">Ne manquez rien!</h3>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Inscrivez-vous aux notifications pour recevoir les dernières nouvelles du concours directement dans votre téléphone.
            </p>
            <Button variant="secondary" size="lg" className="gap-2">
              S'abonner aux notifications
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};