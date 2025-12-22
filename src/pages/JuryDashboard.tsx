import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, LogOut, Star, Music, Mic, Award, 
  CheckCircle, Clock, User, Send, ChevronLeft, ChevronRight,
  BarChart3, History, Bell, Trophy, TrendingUp, Sparkles
} from 'lucide-react';

interface JurySession {
  id: string;
  name: string;
  email: string;
  specialty: string;
  photo_url: string | null;
}

interface Contestant {
  id: string;
  name: string;
  photo_url: string | null;
  category: string | null;
  location: string | null;
  bio: string | null;
  talents: string[] | null;
}

interface JuryVote {
  contestant_id: string;
  score: number;
  comments: string;
  criteria_scores: {
    technique: number;
    creativity: number;
    stage_presence: number;
    originality: number;
  };
}

interface VoteHistoryItem {
  contestant_id: string;
  contestant_name: string;
  score: number;
  created_at: string;
}

const CRITERIA = [
  { key: 'technique', label: 'Technique', icon: Music, description: 'Maîtrise technique du talent' },
  { key: 'creativity', label: 'Créativité', icon: Star, description: 'Originalité et innovation' },
  { key: 'stage_presence', label: 'Présence Scénique', icon: Mic, description: 'Charisme et impact' },
  { key: 'originality', label: 'Authenticité', icon: Award, description: 'Identité haïtienne' },
];

export const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jurySession, setJurySession] = useState<JurySession | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedContestants, setVotedContestants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteHistory, setVoteHistory] = useState<VoteHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Current vote state
  const [currentVote, setCurrentVote] = useState<JuryVote>({
    contestant_id: '',
    score: 5,
    comments: '',
    criteria_scores: {
      technique: 5,
      creativity: 5,
      stage_presence: 5,
      originality: 5,
    }
  });

  useEffect(() => {
    // Check jury session
    const sessionData = localStorage.getItem('jury_session');
    if (!sessionData) {
      navigate('/jury-auth');
      return;
    }
    
    try {
      const session = JSON.parse(sessionData);
      setJurySession(session);
      loadContestants(session.id);
    } catch {
      navigate('/jury-auth');
    }
  }, [navigate]);

  const loadContestants = async (juryId: string) => {
    try {
      // Load active contestants
      const { data: contestantsData, error: contestantsError } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (contestantsError) throw contestantsError;

      // Load already voted contestants
      const { data: votesData, error: votesError } = await supabase
        .from('jury_votes')
        .select('contestant_id')
        .eq('jury_member_id', juryId);

      if (votesError) throw votesError;

      setContestants(contestantsData || []);
      setVotedContestants(votesData?.map(v => v.contestant_id) || []);

      // Build vote history
      if (votesData && contestantsData) {
        const history: VoteHistoryItem[] = [];
        for (const vote of votesData) {
          const contestant = contestantsData.find(c => c.id === vote.contestant_id);
          if (contestant) {
            history.push({
              contestant_id: vote.contestant_id,
              contestant_name: contestant.name,
              score: (vote as any).score || 0,
              created_at: (vote as any).created_at || new Date().toISOString()
            });
          }
        }
        setVoteHistory(history);
      }

      if (contestantsData && contestantsData.length > 0) {
        setCurrentVote(prev => ({ ...prev, contestant_id: contestantsData[0].id }));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jury_session');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté",
    });
    navigate('/jury-auth');
  };

  const handleCriteriaChange = (key: string, value: number[]) => {
    setCurrentVote(prev => ({
      ...prev,
      criteria_scores: {
        ...prev.criteria_scores,
        [key]: value[0]
      }
    }));
  };

  const calculateAverageScore = () => {
    const scores = Object.values(currentVote.criteria_scores);
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  };

  const handleSubmitVote = async () => {
    if (!jurySession || !contestants[currentIndex]) return;

    setSubmitting(true);
    const contestant = contestants[currentIndex];
    const averageScore = calculateAverageScore();

    try {
      const { error } = await supabase
        .from('jury_votes')
        .upsert({
          jury_member_id: jurySession.id,
          contestant_id: contestant.id,
          score: averageScore,
          comments: currentVote.comments,
          criteria_scores: currentVote.criteria_scores,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'jury_member_id,contestant_id'
        });

      if (error) throw error;

      // Update voted list
      if (!votedContestants.includes(contestant.id)) {
        setVotedContestants(prev => [...prev, contestant.id]);
      }

      toast({
        title: "✅ Vote enregistré!",
        description: `Note de ${averageScore}/10 pour ${contestant.name}`,
      });

      // Move to next contestant
      if (currentIndex < contestants.length - 1) {
        setCurrentIndex(prev => prev + 1);
        resetVoteForm();
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le vote",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetVoteForm = () => {
    setCurrentVote({
      contestant_id: contestants[currentIndex + 1]?.id || '',
      score: 5,
      comments: '',
      criteria_scores: {
        technique: 5,
        creativity: 5,
        stage_presence: 5,
        originality: 5,
      }
    });
  };

  const navigateContestant = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'next' && currentIndex < contestants.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const currentContestant = contestants[currentIndex];
  const hasVoted = currentContestant && votedContestants.includes(currentContestant.id);
  const progress = (votedContestants.length / contestants.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4 pt-32 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center shadow-lg">
              {jurySession?.photo_url ? (
                <img 
                  src={jurySession.photo_url} 
                  alt={jurySession.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Shield className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{jurySession?.name}</h1>
              <p className="text-muted-foreground">Membre du Jury • {jurySession?.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={showHistory ? "default" : "outline"} 
              onClick={() => setShowHistory(!showHistory)} 
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Historique
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Votés</p>
                  <p className="text-2xl font-bold text-purple-400">{votedContestants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Restants</p>
                  <p className="text-2xl font-bold text-blue-400">{contestants.length - votedContestants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progression</p>
                  <p className="text-2xl font-bold text-green-400">{Math.round(progress)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Poids Vote</p>
                  <p className="text-2xl font-bold text-yellow-400">49%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression globale</span>
              <Badge variant="secondary">{votedContestants.length} / {contestants.length} candidats</Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Vote History Panel */}
        {showHistory && (
          <Card className="mb-6 bg-card/95 backdrop-blur-sm border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Historique de vos votes
              </CardTitle>
              <CardDescription>
                Tous les votes que vous avez soumis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {voteHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Vous n'avez pas encore voté pour un candidat.
                </p>
              ) : (
                <div className="space-y-3">
                  {voteHistory.map((vote, index) => (
                    <div 
                      key={vote.contestant_id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{vote.contestant_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(vote.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge className="text-lg px-3 bg-primary">
                        {vote.score}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {contestants.length === 0 ? (
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-card">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun candidat</h3>
              <p className="text-muted-foreground">
                Il n'y a pas encore de candidats actifs à noter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contestant Info */}
            <Card className="lg:col-span-1 bg-card/95 backdrop-blur-sm border-0 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateContestant('prev')}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {contestants.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateContestant('next')}
                    disabled={currentIndex === contestants.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block mb-4">
                  {currentContestant?.photo_url ? (
                    <img
                      src={currentContestant.photo_url}
                      alt={currentContestant.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {hasVoted && (
                    <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full p-2">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{currentContestant?.name}</h3>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {currentContestant?.category && (
                    <Badge variant="secondary">{currentContestant.category}</Badge>
                  )}
                  {currentContestant?.location && (
                    <Badge variant="outline">{currentContestant.location}</Badge>
                  )}
                </div>

                {currentContestant?.talents && currentContestant.talents.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {currentContestant.talents.map((talent, i) => (
                      <Badge key={i} className="bg-primary/10 text-primary text-xs">
                        {talent}
                      </Badge>
                    ))}
                  </div>
                )}

                {currentContestant?.bio && (
                  <p className="text-sm text-muted-foreground">
                    {currentContestant.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Voting Form */}
            <Card className="lg:col-span-2 bg-card/95 backdrop-blur-sm border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-highlight" />
                  Évaluation
                </CardTitle>
                <CardDescription>
                  Notez le candidat sur chaque critère (1-10)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Criteria Sliders */}
                {CRITERIA.map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3">
                        {currentVote.criteria_scores[key as keyof typeof currentVote.criteria_scores]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                    <Slider
                      value={[currentVote.criteria_scores[key as keyof typeof currentVote.criteria_scores]]}
                      onValueChange={(value) => handleCriteriaChange(key, value)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}

                {/* Average Score Display */}
                <div className="p-4 bg-gradient-sunset/10 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-1">Note Moyenne</p>
                  <p className="text-4xl font-bold text-primary">{calculateAverageScore()}</p>
                  <p className="text-sm text-muted-foreground">/ 10</p>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commentaires (optionnel)</label>
                  <Textarea
                    placeholder="Vos remarques sur la performance..."
                    value={currentVote.comments}
                    onChange={(e) => setCurrentVote(prev => ({ ...prev, comments: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitVote}
                  disabled={submitting}
                  className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold h-12"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Envoi...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {hasVoted ? 'Modifier ma note' : 'Soumettre ma note'}
                    </span>
                  )}
                </Button>

                {hasVoted && (
                  <p className="text-center text-sm text-accent">
                    ✅ Vous avez déjà noté ce candidat
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legend */}
        <Card className="mt-6 bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-bold text-xl text-white mb-4">📊 Pondération des Votes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg border border-purple-400">
                <Shield className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="font-bold text-white text-lg">Jury: 49%</p>
                  <p className="text-purple-200 text-sm">Performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-400">
                <Award className="h-6 w-6 text-green-400" />
                <div>
                  <p className="font-bold text-white text-lg">Payants: 49%</p>
                  <p className="text-green-200 text-sm">150 HTG/vote</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg border border-blue-400">
                <User className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="font-bold text-white text-lg">Gratuits: 2%</p>
                  <p className="text-blue-200 text-sm">1 vote/jour</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

