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
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, LogOut, Star, Music, Mic, Award, 
  CheckCircle, Clock, User, Send, ChevronLeft, ChevronRight,
  BarChart3, History, Bell, Trophy, TrendingUp, Sparkles, Loader2
} from 'lucide-react';

interface JuryMemberInfo {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
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
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [juryMember, setJuryMember] = useState<JuryMemberInfo | null>(null);
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
    const checkJuryAccess = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate('/jury-auth');
        return;
      }

      try {
        // Get jury member ID using the secure function
        const { data: juryMemberId, error: idError } = await supabase.rpc('get_jury_member_id', {
          _user_id: user.id
        });

        if (idError || !juryMemberId) {
          toast({
            title: "Accès refusé",
            description: "Vous n'êtes pas autorisé à accéder à l'espace jury",
            variant: "destructive"
          });
          await signOut();
          navigate('/jury-auth');
          return;
        }

        // Get jury member details (using admin-only policy, so we fetch from RPC or use auth data)
        // Since we can't read jury_members directly, use a simpler approach
        setJuryMember({
          id: juryMemberId,
          name: user.email?.split('@')[0] || 'Membre du Jury',
          email: user.email || '',
          specialty: null,
          photo_url: null
        });

        loadContestants(juryMemberId);
      } catch (error) {
        console.error('Error checking jury access:', error);
        navigate('/jury-auth');
      }
    };

    checkJuryAccess();
  }, [user, authLoading, navigate, toast, signOut]);

  const loadContestants = async (juryMemberId: string) => {
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
        .select('contestant_id, score, created_at')
        .eq('jury_member_id', juryMemberId);

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
              score: vote.score || 0,
              created_at: vote.created_at || new Date().toISOString()
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

  const handleLogout = async () => {
    await signOut();
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
    if (!juryMember || !contestants[currentIndex]) return;

    setSubmitting(true);
    const contestant = contestants[currentIndex];
    const averageScore = calculateAverageScore();

    try {
      // The trigger will automatically set the correct jury_member_id based on auth.uid()
      const { error } = await supabase
        .from('jury_votes')
        .upsert({
          jury_member_id: juryMember.id,
          contestant_id: contestant.id,
          score: averageScore,
          comments: currentVote.comments.substring(0, 1000), // Enforce max length
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
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'enregistrer le vote",
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
    // Reset form when navigating
    setCurrentVote(prev => ({
      ...prev,
      contestant_id: contestants[direction === 'prev' ? currentIndex - 1 : currentIndex + 1]?.id || '',
      comments: '',
      criteria_scores: {
        technique: 5,
        creativity: 5,
        stage_presence: 5,
        originality: 5,
      }
    }));
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const currentContestant = contestants[currentIndex];
  const hasVoted = currentContestant ? votedContestants.includes(currentContestant.id) : false;
  const progress = contestants.length > 0 ? (votedContestants.length / contestants.length) * 100 : 0;

  return (
    <div className="min-h-screen py-6 px-4 pt-32 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tableau de Vote</h1>
              <p className="text-muted-foreground">
                {juryMember?.name} • {juryMember?.specialty || 'Membre du Jury'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Historique
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{votedContestants.length}</p>
                <p className="text-sm text-muted-foreground">Candidats évalués</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{contestants.length - votedContestants.length}</p>
                <p className="text-sm text-muted-foreground">Restants</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
                <p className="text-sm text-muted-foreground">Progression</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {votedContestants.length} sur {contestants.length} candidats évalués
          </p>
        </div>

        {/* Vote History Panel */}
        {showHistory && (
          <Card className="mb-8 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {voteHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Aucun vote enregistré</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {voteHistory.map((vote) => (
                    <div key={vote.contestant_id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{vote.contestant_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{vote.score}/10</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {contestants.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun candidat</h3>
              <p className="text-muted-foreground">Il n'y a pas encore de candidats à évaluer.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contestant Card */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Candidat {currentIndex + 1}/{contestants.length}
                  </CardTitle>
                  {hasVoted && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Évalué
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  {currentContestant?.photo_url ? (
                    <img
                      src={currentContestant.photo_url}
                      alt={currentContestant.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto bg-gradient-sunset flex items-center justify-center shadow-lg">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mt-4">{currentContestant?.name}</h2>
                  {currentContestant?.category && (
                    <Badge variant="secondary" className="mt-2">{currentContestant.category}</Badge>
                  )}
                  {currentContestant?.location && (
                    <p className="text-muted-foreground text-sm mt-1">{currentContestant.location}</p>
                  )}
                </div>

                {currentContestant?.talents && currentContestant.talents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Talents:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentContestant.talents.map((talent, idx) => (
                        <Badge key={idx} variant="outline">{talent}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentContestant?.bio && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{currentContestant.bio}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigateContestant('prev')}
                    disabled={currentIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigateContestant('next')}
                    disabled={currentIndex === contestants.length - 1}
                    className="gap-2"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voting Card */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Évaluation
                </CardTitle>
                <CardDescription>
                  Notez chaque critère de 1 à 10
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {CRITERIA.map((criterion) => {
                  const Icon = criterion.icon;
                  const value = currentVote.criteria_scores[criterion.key as keyof typeof currentVote.criteria_scores];
                  
                  return (
                    <div key={criterion.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{criterion.label}</span>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3">
                          {value}/10
                        </Badge>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(val) => handleCriteriaChange(criterion.key, val)}
                        min={1}
                        max={10}
                        step={1}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">{criterion.description}</p>
                    </div>
                  );
                })}

                {/* Average Score Display */}
                <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Score Moyen</p>
                  <p className="text-4xl font-bold text-primary">{calculateAverageScore()}/10</p>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commentaires (optionnel)</label>
                  <Textarea
                    value={currentVote.comments}
                    onChange={(e) => setCurrentVote(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Vos observations sur la performance..."
                    className="resize-none"
                    rows={3}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {currentVote.comments.length}/1000 caractères
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitVote}
                  disabled={submitting || !currentContestant}
                  className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold h-12 text-lg gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi...
                    </>
                  ) : hasVoted ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Mettre à jour le vote
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Soumettre le vote
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legend */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pondération des votes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Jury (Performance): <strong>49%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Votes Payants: <strong>49%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Votes Gratuits: <strong>2%</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
