import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Play, Share2 } from 'lucide-react';
import { useLanguage } from './LanguageSwitcher';

export interface Contestant {
  id: string;
  name: string;
  age: number;
  talent: string;
  city: string;
  votes: number;
  videoUrl?: string;
  imageUrl?: string;
  description: string;
}

interface ContestantCardProps {
  contestant: Contestant;
  onVote?: (id: string) => void;
  onPlay?: (id: string) => void;
  className?: string;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({ 
  contestant, 
  onVote, 
  onPlay,
  className 
}) => {
  const { t } = useLanguage();

  const getTalentColor = (talent: string) => {
    switch (talent.toLowerCase()) {
      case 'singing':
      case 'chante':
      case 'chant':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'dancing':
      case 'danse':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'drawing':
      case 'deseye':
      case 'dessin':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'poetry':
      case 'poezi':
      case 'poésie':
        return 'bg-highlight/10 text-highlight border-highlight/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className={`group hover:shadow-talent transition-all duration-300 hover:scale-105 overflow-hidden ${className}`}>
      <div className="relative">
        <div className="aspect-video bg-gradient-ocean rounded-t-lg relative overflow-hidden">
          {contestant.imageUrl ? (
            <img 
              src={contestant.imageUrl} 
              alt={contestant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-primary">
              <Play className="h-12 w-12 text-primary-foreground/80" />
            </div>
          )}
          {onPlay && (
            <Button
              variant="hero"
              size="icon"
              className="absolute inset-0 m-auto w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onPlay(contestant.id)}
            >
              <Play className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={contestant.imageUrl} alt={contestant.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {contestant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{contestant.name}</h3>
              <p className="text-sm text-muted-foreground">{contestant.age} ans • {contestant.city}</p>
            </div>
          </div>
          <Badge className={getTalentColor(contestant.talent)}>
            {t(`talents.${contestant.talent.toLowerCase()}`)}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {contestant.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{contestant.votes.toLocaleString()} votes</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 className="h-3 w-3" />
            Partager
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          variant="vote" 
          className="w-full gap-2"
          onClick={() => onVote?.(contestant.id)}
        >
          <Heart className="h-4 w-4" />
          {t('vote.button')}
        </Button>
      </CardFooter>
    </Card>
  );
};