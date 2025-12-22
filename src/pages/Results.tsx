import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, Medal, Award, Star, Users, 
  TrendingUp, Crown, Sparkles, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContestantResult {
  id: string;
  name: string;
  photo_url: string | null;
  category: string | null;
  location: string | null;
  free_votes: number;
  paid_votes: number;
  jury_score: number;
  weighted_score: number;
  total_amount: number;
}

export const Results: React.FC = () => {
  const [results, setResults] = useState<ContestantResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadResults = async () => {
    try {
      // Load contestants
      const { data: contestants, error: contestantsError } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'active');

      if (contestantsError) throw contestantsError;

      // For each contestant, calculate votes (simplified version)
      const resultsData: ContestantResult[] = (contestants || []).map(c => ({
        id: c.id,
        name: c.name,
        photo_url: c.photo_url,
        category: c.category,
        location: c.location,
        free_votes: Math.floor(Math.random() * 100), // Placeholder
        paid_votes: Math.floor(Math.random() * 50), // Placeholder
        jury_score: Math.random() * 10, // Placeholder
        weighted_score: Math.random() * 100, // Placeholder
        total_amount: Math.floor(Math.random() * 50) * 150 // Placeholder
      }));

      // Sort by weighted score
      resultsData.sort((a, b) => b.weighted_score - a.weighted_score);
      
      setResults(resultsData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadResults, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-400" />;
      case 2:
        return <Medal className="h-7 w-7 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 via-gray-300/10 to-gray-400/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border-amber-500/50';
      default:
        return 'bg-card border-border';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🏆</div>
          <p className="text-muted-foreground">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-32 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Classement Live
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">
            Résultats en temps réel • Ayiti Talents 2025
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-muted-foreground">Votes Jury</p>
              <p className="text-2xl font-bold text-purple-400">49%</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-muted-foreground">Votes Payants</p>
              <p className="text-2xl font-bold text-green-400">49%</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-muted-foreground">Votes Gratuits</p>
              <p className="text-2xl font-bold text-blue-400">2%</p>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
          <Button variant="outline" size="sm" onClick={loadResults} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <Card className="bg-card/95">
              <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pas encore de résultats</h3>
                <p className="text-muted-foreground">
                  Les résultats apparaîtront ici une fois les votes commencés.
                </p>
              </CardContent>
            </Card>
          ) : (
            results.map((contestant, index) => {
              const rank = index + 1;
              return (
                <Card key={contestant.id} className={`overflow-hidden border-2 ${getRankBg(rank)} transition-all hover:scale-[1.01]`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 flex items-center justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {contestant.photo_url ? (
                          <img
                            src={contestant.photo_url}
                            alt={contestant.name}
                            className={`w-16 h-16 rounded-full object-cover border-2 ${
                              rank === 1 ? 'border-yellow-400' : 
                              rank === 2 ? 'border-gray-300' : 
                              rank === 3 ? 'border-amber-500' : 'border-border'
                            }`}
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 ${
                            rank === 1 ? 'border-yellow-400' : 
                            rank === 2 ? 'border-gray-300' : 
                            rank === 3 ? 'border-amber-500' : 'border-border'
                          }`}>
                            <span className="text-2xl font-bold text-muted-foreground">
                              {contestant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg truncate ${rank <= 3 ? 'text-white' : ''}`}>
                          {contestant.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {contestant.category && (
                            <Badge variant="secondary" className="text-xs">
                              {contestant.category}
                            </Badge>
                          )}
                          {contestant.location && (
                            <Badge variant="outline" className="text-xs">
                              {contestant.location}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <Progress value={contestant.weighted_score} className="h-2" />
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-3xl font-bold ${
                          rank === 1 ? 'text-yellow-400' : 
                          rank === 2 ? 'text-gray-300' : 
                          rank === 3 ? 'text-amber-500' : 'text-primary'
                        }`}>
                          {contestant.weighted_score.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>

                    {/* Vote Details (for top 3) */}
                    {rank <= 3 && (
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-purple-300">Jury</p>
                          <p className="font-bold text-white">{contestant.jury_score.toFixed(1)}/10</p>
                        </div>
                        <div>
                          <p className="text-green-300">Payants</p>
                          <p className="font-bold text-white">{contestant.paid_votes} votes</p>
                        </div>
                        <div>
                          <p className="text-blue-300">Gratuits</p>
                          <p className="font-bold text-white">{contestant.free_votes} votes</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h4 className="font-bold text-lg mb-2">Comment ça marche ?</h4>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Le score final est calculé en combinant les notes du jury (49%), 
              les votes payants (49%) et les votes gratuits (2%). 
              Le classement est mis à jour en temps réel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;

