import React, { useState } from 'react';
import { ContestantCard, type Contestant } from '@/components/ContestantCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Vote as VoteIcon, Clock, Award, Users, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { SocialShare } from '@/components/SocialShare';
import { useVoteProtection } from '@/hooks/useVoteProtection';

// Featured contestants for voting
const featuredContestants: Contestant[] = [
  {
    id: '1',
    name: 'Marie-Claire Joseph',
    age: 19,
    talent: 'singing',
    city: 'Port-au-Prince',
    votes: 1247,
    description: 'Passionnée de musique depuis l\'enfance, je chante dans la chorale de mon église.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c5a5?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Jean-Baptiste Pierre',
    age: 21,
    talent: 'dancing',
    city: 'Cap-Haïtien',
    votes: 892,
    description: 'Danseur de konpa et de hip-hop, j\'aime fusionner les styles traditionnels.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mackenson Charles',
    age: 24,
    talent: 'dancing',
    city: 'Pétion-Ville',
    votes: 1105,
    description: 'Chorégraphe et danseur professionnel, je forme de jeunes talents.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  }
];

export const Vote: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contestants] = useState<Contestant[]>(featuredContestants);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastVotedCandidate, setLastVotedCandidate] = useState<string | null>(null);
  const { canVote, recordVote, hasVotedFor, getTimeUntilNextVote, formatTimeRemaining } = useVoteProtection();

  const totalVotes = contestants.reduce((sum, contestant) => sum + contestant.votes, 0);
  const maxVotes = Math.max(...contestants.map(c => c.votes));
  const hasVotedToday = contestants.some(c => hasVotedFor(c.id));

  const handleVote = (id: string) => {
    if (!canVote(id)) {
      const timeRemaining = getTimeUntilNextVote(id);
      toast({
        title: "Vote déjà effectué",
        description: `Vous pourrez voter à nouveau dans ${formatTimeRemaining(timeRemaining)}`,
        variant: "destructive"
      });
      return;
    }

    const success = recordVote(id);
    if (success) {
      setShowConfetti(true);
      setLastVotedCandidate(contestants.find(c => c.id === id)?.name || null);
      toast({
        title: "🎉 Vote enregistré!",
        description: "Merci pour votre vote. Partagez pour aider votre candidat!",
      });
    }
  };

  const handlePlay = (id: string) => {
    toast({
      title: "Lecture de la vidéo",
      description: "Ouverture du contenu du candidat...",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-48 bg-background">
      {/* Confetti Effect */}
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('vote.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Soutenez vos candidats préférés! Chaque utilisateur peut voter une fois par jour pour maintenir l'équité de la compétition.
          </p>
          
          {/* Share Section */}
          {lastVotedCandidate && (
            <div className="mt-6 p-4 bg-primary/10 rounded-xl inline-block">
              <p className="text-sm text-primary mb-2 font-medium">
                🎉 Vous avez voté pour {lastVotedCandidate}! Partagez pour aider:
              </p>
              <SocialShare 
                title={`J'ai voté pour ${lastVotedCandidate} sur Rayon des Jeunes Talents!`}
                candidateName={lastVotedCandidate}
              />
            </div>
          )}
        </div>

        {/* Voting Status */}
        <Card className="mb-8 bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VoteIcon className="h-5 w-5 text-primary" />
              Statut de Vote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  hasVotedToday ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  <VoteIcon className={`h-8 w-8 ${
                    hasVotedToday ? 'text-accent' : 'text-primary'
                  }`} />
                </div>
                <h3 className="font-semibold">Votre Vote</h3>
                <p className="text-sm text-muted-foreground">
                  {hasVotedToday ? 'Effectué aujourd\'hui' : 'Disponible'}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold">Prochain Vote</h3>
                <p className="text-sm text-muted-foreground">
                  {hasVotedToday ? `Dans ${formatTimeRemaining(getTimeUntilNextVote())}` : 'Maintenant'}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-highlight/20 rounded-full flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-highlight" />
                </div>
                <h3 className="font-semibold">Total des Votes</h3>
                <p className="text-sm text-muted-foreground">
                  {totalVotes.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card className="mb-8 bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-highlight" />
              Classement Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contestants
                .sort((a, b) => b.votes - a.votes)
                .map((contestant, index) => (
                  <div key={contestant.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-sunset text-white' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{contestant.name}</h4>
                        <span className="text-sm font-medium">{contestant.votes.toLocaleString()} votes</span>
                      </div>
                      <Progress 
                        value={(contestant.votes / maxVotes) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Voting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            Candidats Mis en Avant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contestants.map((contestant) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                onVote={handleVote}
                onPlay={handlePlay}
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>

        {/* Rules */}
        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardHeader>
            <CardTitle>Règles de Vote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>Un vote par utilisateur par jour pour maintenir l'équité</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>Les votes se réinitialisent chaque jour à minuit</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p>Consultez les profils complets avant de voter</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <p>Les résultats sont mis à jour en temps réel</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};