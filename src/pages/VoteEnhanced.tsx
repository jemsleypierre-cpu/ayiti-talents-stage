import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { 
  Vote as VoteIcon, Clock, Award, Users, Share2, 
  CreditCard, Gift, Trophy, TrendingUp, Heart,
  Smartphone, DollarSign, CheckCircle, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { SocialShare } from '@/components/SocialShare';

interface Contestant {
  id: string;
  name: string;
  photo_url: string | null;
  category: string | null;
  location: string | null;
  bio: string | null;
  talents: string[] | null;
  total_votes: number | null;
}

interface WeightedScore {
  id: string;
  name: string;
  photo_url: string | null;
  free_votes: number;
  paid_votes: number;
  jury_score: number;
  weighted_score: number;
  total_amount: number;
}

// Prix par défaut (sera remplacé par les settings de la DB)
const DEFAULT_VOTE_PRICE = 150;

export const VoteEnhanced: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [scores, setScores] = useState<WeightedScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastVotedCandidate, setLastVotedCandidate] = useState<string | null>(null);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [voteCount, setVoteCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'moncash' | 'natcash'>('moncash');
  const [paymentReference, setPaymentReference] = useState('');
  const [submittingVote, setSubmittingVote] = useState(false);

  // Payment settings from database
  const [paymentSettings, setPaymentSettings] = useState({
    moncash_number: '3208-4512',
    natcash_number: '3208-4512',
    vote_price: DEFAULT_VOTE_PRICE
  });

  // Free vote tracking
  const [hasVotedToday, setHasVotedToday] = useState(false);

  useEffect(() => {
    loadContestants();
    loadPaymentSettings();
    checkTodayVote();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('*')
        .in('key', ['moncash_number', 'natcash_number', 'vote_price']);

      if (error) throw error;
      
      if (data) {
        const settings: any = {};
        data.forEach((item: any) => {
          if (item.key === 'vote_price') {
            settings[item.key] = parseInt(item.value) || DEFAULT_VOTE_PRICE;
          } else {
            settings[item.key] = item.value;
          }
        });
        setPaymentSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (err) {
      console.error('Error loading payment settings:', err);
    }
  };

  const loadContestants = async () => {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'active')
        .order('total_votes', { ascending: false });

      if (error) throw error;
      setContestants(data || []);
      
      // Calculate weighted scores (simplified version)
      const weightedScores: WeightedScore[] = (data || []).map(c => ({
        id: c.id,
        name: c.name,
        photo_url: c.photo_url,
        free_votes: c.total_votes || 0,
        paid_votes: 0, // Would need to query votes table
        jury_score: 0, // Would need to query jury_votes table
        weighted_score: (c.total_votes || 0) * 0.02, // Simplified
        total_amount: 0
      }));
      setScores(weightedScores);
    } catch (err) {
      console.error('Error loading contestants:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTodayVote = () => {
    const lastVote = localStorage.getItem('last_free_vote');
    if (lastVote) {
      const lastVoteDate = new Date(lastVote);
      const today = new Date();
      if (lastVoteDate.toDateString() === today.toDateString()) {
        setHasVotedToday(true);
      }
    }
  };

  const handleFreeVote = async (contestant: Contestant) => {
    if (hasVotedToday) {
      toast({
        title: "Vote déjà effectué",
        description: "Vous avez déjà voté gratuitement aujourd'hui. Utilisez les votes payants pour soutenir davantage!",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          contestant_id: contestant.id,
          voter_ip: 'browser',
          voter_session: localStorage.getItem('session_id') || crypto.randomUUID(),
          vote_type: 'free'
        });

      if (error) throw error;

      // Update local storage
      localStorage.setItem('last_free_vote', new Date().toISOString());
      setHasVotedToday(true);
      setShowConfetti(true);
      setLastVotedCandidate(contestant.name);

      toast({
        title: "🎉 Vote gratuit enregistré!",
        description: `Merci d'avoir voté pour ${contestant.name}!`,
      });

      loadContestants();
    } catch (err) {
      console.error('Error voting:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le vote",
        variant: "destructive"
      });
    }
  };

  const openPaymentModal = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setVoteCount(1);
    setPaymentReference('');
    setShowPaymentModal(true);
  };

  const handlePaidVote = async () => {
    if (!selectedContestant || !paymentReference.trim()) {
      toast({
        title: "Information manquante",
        description: "Veuillez entrer la référence de paiement",
        variant: "destructive"
      });
      return;
    }

    setSubmittingVote(true);

    try {
      // Insert paid votes
      const votes = Array(voteCount).fill(null).map(() => ({
        contestant_id: selectedContestant.id,
        voter_ip: 'browser',
        voter_session: localStorage.getItem('session_id') || crypto.randomUUID(),
        vote_type: 'paid',
        amount_paid: paymentSettings.vote_price,
        payment_reference: paymentReference,
        payment_method: paymentMethod
      }));

      const { error } = await supabase
        .from('votes')
        .insert(votes);

      if (error) throw error;

      setShowConfetti(true);
      setLastVotedCandidate(selectedContestant.name);
      setShowPaymentModal(false);

      toast({
        title: "🎉 Votes payants enregistrés!",
        description: `${voteCount} vote(s) pour ${selectedContestant.name} (${voteCount * paymentSettings.vote_price} HTG)`,
      });

      loadContestants();
    } catch (err) {
      console.error('Error submitting paid votes:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les votes payants",
        variant: "destructive"
      });
    } finally {
      setSubmittingVote(false);
    }
  };

  const totalAmount = voteCount * paymentSettings.vote_price;

  return (
    <div className="min-h-screen py-8 px-4 pt-48 bg-background">
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            🗳️ Votez pour vos Favoris
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Soutenez vos candidats préférés avec des votes gratuits ou payants!
          </p>
          
          {/* Share Section */}
          {lastVotedCandidate && (
            <div className="mt-4 p-4 bg-primary/10 rounded-xl inline-block">
              <p className="text-sm text-primary mb-2 font-medium">
                🎉 Vous avez voté pour {lastVotedCandidate}! Partagez:
              </p>
              <SocialShare 
                title={`J'ai voté pour ${lastVotedCandidate} sur Ayiti Talents!`}
                candidateName={lastVotedCandidate}
              />
            </div>
          )}
        </div>

        {/* ========== SYSTÈME DE NOTATION - EXPLICATION CLAIRE ========== */}
        <Card className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-3">
              📊 SYSTÈME DE NOTATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vote Gratuit */}
              <div className="bg-blue-500/20 border-2 border-blue-400 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Vote Gratuit</h3>
                <p className="text-blue-200 text-lg mb-3">1 vote par jour</p>
                <div className="bg-blue-600 text-white font-bold text-xl py-2 px-4 rounded-full inline-block">
                  2% du score
                </div>
              </div>

              {/* Vote Payant */}
              <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  RECOMMANDÉ
                </div>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Vote Payant</h3>
                <p className="text-green-200 text-lg mb-3">{paymentSettings.vote_price} HTG par vote</p>
                <div className="bg-green-600 text-white font-bold text-xl py-2 px-4 rounded-full inline-block">
                  49% du score
                </div>
              </div>

              {/* Vote Jury */}
              <div className="bg-purple-500/20 border-2 border-purple-400 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Vote Jury</h3>
                <p className="text-purple-200 text-lg mb-3">Performance</p>
                <div className="bg-purple-600 text-white font-bold text-xl py-2 px-4 rounded-full inline-block">
                  49% du score
                </div>
              </div>
            </div>
            
            <p className="text-center text-white/70 mt-6 text-sm">
              💡 Les votes payants et les performances du jury ont le même poids dans le classement final!
            </p>
          </CardContent>
        </Card>

        {/* Your Vote Status */}
        <Card className="mb-8 bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VoteIcon className="h-5 w-5 text-primary" />
              Votre Statut de Vote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  hasVotedToday ? 'bg-muted' : 'bg-primary/20'
                }`}>
                  {hasVotedToday ? (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Gift className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">Vote Gratuit du Jour</h4>
                  <p className="text-sm text-muted-foreground">
                    {hasVotedToday ? 'Déjà utilisé - Revenez demain!' : 'Disponible maintenant'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-xl">
                <CreditCard className="h-8 w-8 text-accent" />
                <div>
                  <h4 className="font-semibold text-accent">Votes Payants</h4>
                  <p className="text-sm text-muted-foreground">Illimités • {paymentSettings.vote_price} HTG/vote</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contestants Grid */}
        <Tabs defaultValue="vote" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="vote" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Voter
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Classement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-muted-foreground">Chargement des candidats...</p>
              </div>
            ) : contestants.length === 0 ? (
              <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-card">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun candidat</h3>
                  <p className="text-muted-foreground">
                    Les candidats seront bientôt disponibles pour voter.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contestants.map((contestant) => (
                  <Card key={contestant.id} className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-card overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all">
                    <div className="relative h-48 overflow-hidden">
                      {contestant.photo_url ? (
                        <img
                          src={contestant.photo_url}
                          alt={contestant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-sunset flex items-center justify-center">
                          <span className="text-6xl text-white/50">🎭</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-foreground font-bold px-3 py-1">
                          🗳️ {contestant.total_votes || 0} votes
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl mb-2 text-foreground">{contestant.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {contestant.category && (
                          <Badge variant="secondary" className="text-sm px-3 py-1">{contestant.category}</Badge>
                        )}
                        {contestant.location && (
                          <Badge variant="outline" className="text-sm px-3 py-1">📍 {contestant.location}</Badge>
                        )}
                      </div>
                      
                      {contestant.bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {contestant.bio}
                        </p>
                      )}

                      {/* ========== BOUTONS DE VOTE - TOUJOURS VISIBLES ========== */}
                      <div className="border-t pt-4 mt-4">
                        <p className="text-xs text-center text-muted-foreground mb-3 font-medium">
                          👇 VOTEZ MAINTENANT 👇
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex items-center justify-center gap-2 h-14 text-base font-bold border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all"
                            onClick={() => handleFreeVote(contestant)}
                            disabled={hasVotedToday}
                          >
                            <Gift className="h-5 w-5" />
                            {hasVotedToday ? '✓ Voté' : 'GRATUIT'}
                          </Button>
                          <Button
                            size="lg"
                            className="flex items-center justify-center gap-2 h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none"
                            onClick={() => openPaymentModal(contestant)}
                          >
                            <CreditCard className="h-5 w-5" />
                            {paymentSettings.vote_price} HTG
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-highlight" />
                  Classement Pondéré
                </CardTitle>
                <CardDescription className="text-base">
                  Score basé sur: <strong>Jury (49%)</strong> + <strong>Votes Payants (49%)</strong> + Votes Gratuits (2%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contestants
                    .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                    .map((contestant, index) => (
                      <div 
                        key={contestant.id} 
                        className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-gradient-sunset text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          {contestant.photo_url ? (
                            <img
                              src={contestant.photo_url}
                              alt={contestant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-xl">🎭</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{contestant.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{contestant.total_votes || 0} votes</span>
                            {contestant.category && (
                              <>
                                <span>•</span>
                                <span>{contestant.category}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {((contestant.total_votes || 0) * 0.02).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Vote Payant
              </DialogTitle>
              <DialogDescription>
                Votez pour {selectedContestant?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Vote Count */}
              <div className="space-y-2">
                <Label>Nombre de votes</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                    disabled={voteCount <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={voteCount}
                    onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min={1}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoteCount(voteCount + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-accent/10 rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">Total à payer</p>
                <p className="text-3xl font-bold text-accent">{totalAmount} HTG</p>
                <p className="text-xs text-muted-foreground">
                  {voteCount} vote(s) × {paymentSettings.vote_price} HTG
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Méthode de paiement</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === 'moncash' ? 'default' : 'outline'}
                    className={paymentMethod === 'moncash' ? 'bg-[#FF6B00]' : ''}
                    onClick={() => setPaymentMethod('moncash')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    MonCash
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'natcash' ? 'default' : 'outline'}
                    className={paymentMethod === 'natcash' ? 'bg-[#00A651]' : ''}
                    onClick={() => setPaymentMethod('natcash')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    NatCash
                  </Button>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="p-4 bg-muted/50 rounded-xl space-y-3 text-sm">
                <p className="font-semibold text-base">📱 Instructions de Paiement:</p>
                {paymentMethod === 'moncash' ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-[#FF6B00]/10 rounded-lg border border-[#FF6B00]/20">
                      <p className="font-bold text-[#FF6B00] mb-1">MonCash</p>
                      <p className="text-xs text-muted-foreground">Numéro: <strong className="text-foreground">{paymentSettings.moncash_number}</strong></p>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Ouvrez <strong>MonCash</strong> sur votre téléphone</li>
                      <li>Allez dans <strong>"Envoyer de l'argent"</strong></li>
                      <li>Entrez le numéro: <strong className="text-foreground">{paymentSettings.moncash_number}</strong></li>
                      <li>Montant: <strong className="text-foreground">{totalAmount} HTG</strong></li>
                      <li>Confirmez et notez le <strong>numéro de transaction</strong></li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-[#00A651]/10 rounded-lg border border-[#00A651]/20">
                      <p className="font-bold text-[#00A651] mb-1">NatCash</p>
                      <p className="text-xs text-muted-foreground">Numéro: <strong className="text-foreground">{paymentSettings.natcash_number}</strong></p>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Ouvrez <strong>NatCash</strong> sur votre téléphone</li>
                      <li>Allez dans <strong>"Transfert d'argent"</strong></li>
                      <li>Entrez le numéro: <strong className="text-foreground">{paymentSettings.natcash_number}</strong></li>
                      <li>Montant: <strong className="text-foreground">{totalAmount} HTG</strong></li>
                      <li>Confirmez et notez le <strong>numéro de transaction</strong></li>
                    </ol>
                  </div>
                )}
                <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-yellow-600 text-xs">
                  ⚠️ Gardez votre reçu! Le numéro de transaction est nécessaire pour valider votre vote.
                </div>
              </div>

              {/* Payment Reference */}
              <div className="space-y-2">
                <Label htmlFor="reference">Numéro de confirmation *</Label>
                <Input
                  id="reference"
                  placeholder="Ex: MC123456789"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handlePaidVote}
                disabled={submittingVote || !paymentReference.trim()}
                className="bg-gradient-sunset hover:opacity-90"
              >
                {submittingVote ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmer {voteCount} vote(s)
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

