import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Search, Users, Trophy, Star, Music, Play, Vote, Heart, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Candidate {
  id: string;
  name: string;
  age: number | null;
  category: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
  showcase_file_url?: string | null;
  total_votes: number | null;
}

export const Contestants: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Charger les candidats approuvés
  const loadCandidates = async () => {
    setLoading(true);
    try {
      // D'abord essayer de charger depuis la table contestants
      let { data: contestantsData, error: contestantsError } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'active')
        .order('total_votes', { ascending: false });

      if (contestantsError) throw contestantsError;

      // Si pas de données dans contestants, charger les candidatures approuvées
      if (!contestantsData || contestantsData.length === 0) {
        const { data: applicationsData, error: applicationsError } = await (supabase as any)
          .from('candidate_applications')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (applicationsError) throw applicationsError;

        // Mapper les données
        const mappedCandidates = (applicationsData || []).map((app: any) => ({
          id: app.id,
          name: app.name,
          age: app.age,
          category: app.category,
          location: app.location,
          bio: app.bio,
          photo_url: app.photo_url,
          showcase_file_url: app.showcase_file_url,
          total_votes: 0
        }));

        setCandidates(mappedCandidates);
      } else {
        // Map contestants data to include optional showcase_file_url
        setCandidates(contestantsData.map(c => ({
          ...c,
          showcase_file_url: null // La table contestants n'a pas cette colonne
        })));
      }
    } catch (error: any) {
      console.error('Erreur chargement candidats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // Voter pour un candidat
  const handleVote = async (candidateId: string) => {
    try {
      // Enregistrer le vote
      const { error } = await supabase
        .from('votes')
        .insert({
          contestant_id: candidateId,
          voter_ip: 'anonymous',
          voter_session: localStorage.getItem('voter_session') || Math.random().toString(36)
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Déjà voté",
            description: "Vous avez déjà voté pour ce candidat aujourd'hui.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      // Sauvegarder la session de vote
      if (!localStorage.getItem('voter_session')) {
        localStorage.setItem('voter_session', Math.random().toString(36));
      }

      toast({
        title: "Vote enregistré! 🎉",
        description: "Merci pour votre vote!",
      });

      // Recharger les candidats
      loadCandidates();
    } catch (error: any) {
      console.error('Erreur vote:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de voter",
        variant: "destructive"
      });
    }
  };

  // Ouvrir la vidéo
  const openVideo = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowVideoModal(true);
  };

  // Filtrer les candidats
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (candidate.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || candidate.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'singing': 'Chant 🎤',
      'dancing': 'Danse 💃',
      'drawing': 'Dessin 🎨',
      'poetry': 'Poésie 📝'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'singing': 'from-pink-500 to-rose-500',
      'dancing': 'from-purple-500 to-indigo-500',
      'drawing': 'from-green-500 to-emerald-500',
      'poetry': 'from-amber-500 to-orange-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen gradient-teal">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 pt-48">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            Nos Talents 🌟
          </h1>
          <p className="text-white/80">
            Découvrez et votez pour vos candidats préférés
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-bar flex items-center gap-3 max-w-xl mx-auto mb-8">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un talent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`pill ${selectedCategory === 'all' ? 'pill-active' : 'pill-inactive'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setSelectedCategory('singing')}
            className={`pill ${selectedCategory === 'singing' ? 'pill-active' : 'pill-inactive'}`}
          >
            🎤 Chant
          </button>
          <button 
            onClick={() => setSelectedCategory('dancing')}
            className={`pill ${selectedCategory === 'dancing' ? 'pill-active' : 'pill-inactive'}`}
          >
            💃 Danse
          </button>
          <button 
            onClick={() => setSelectedCategory('poetry')}
            className={`pill ${selectedCategory === 'poetry' ? 'pill-active' : 'pill-inactive'}`}
          >
            📝 Poésie
          </button>
          <button 
            onClick={() => setSelectedCategory('drawing')}
            className={`pill ${selectedCategory === 'drawing' ? 'pill-active' : 'pill-inactive'}`}
          >
            🎨 Dessin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="white-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{candidates.length}</div>
            <div className="text-sm text-gray-500">Candidats</div>
          </div>
          <div className="white-card p-4 text-center">
            <div className="text-2xl font-bold text-accent">{candidates.reduce((sum, c) => sum + (c.total_votes || 0), 0)}</div>
            <div className="text-sm text-gray-500">Votes</div>
          </div>
          <div className="white-card p-4 text-center">
            <div className="text-2xl font-bold text-pink-500">{candidates.filter(c => c.category === 'singing').length}</div>
            <div className="text-sm text-gray-500">Chanteurs</div>
          </div>
          <div className="white-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{candidates.filter(c => c.category === 'dancing').length}</div>
            <div className="text-sm text-gray-500">Danseurs</div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Chargement des candidats...</p>
          </div>
        )}

        {/* No Candidates */}
        {!loading && filteredCandidates.length === 0 && (
          <div className="white-card p-12 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun candidat trouvé</h3>
            <p className="text-gray-500 mb-6">
              {candidates.length === 0 
                ? "Aucun candidat n'a encore été approuvé. Revenez bientôt!"
                : "Essayez de modifier vos filtres de recherche"}
            </p>
            {candidates.length > 0 && (
              <Button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="gradient-cta text-gray-900 font-bold rounded-full"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        )}

        {/* Candidates Grid */}
        {!loading && filteredCandidates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="white-card overflow-hidden card-hover">
                {/* Photo */}
                <div className="relative">
                  <div className={`h-48 bg-gradient-to-br ${getCategoryColor(candidate.category)} flex items-center justify-center`}>
                    {candidate.photo_url ? (
                      <img 
                        src={candidate.photo_url} 
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">
                        {candidate.category === 'singing' ? '🎤' : 
                         candidate.category === 'dancing' ? '💃' :
                         candidate.category === 'drawing' ? '🎨' : '📝'}
                      </div>
                    )}
                  </div>
                  
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div className="absolute top-3 left-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {getCategoryLabel(candidate.category)}
                    </span>
                  </div>

                  {/* Play Button for Video */}
                  {candidate.showcase_file_url && (
                    <button 
                      onClick={() => openVideo(candidate)}
                      className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="h-5 w-5 text-gray-800 ml-1" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">
                        {candidate.age} ans • {candidate.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="font-bold text-gray-800">{candidate.total_votes || 0}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {candidate.bio || "Candidat talentueux prêt à briller!"}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleVote(candidate.id)}
                      className="flex-1 gradient-cta text-gray-900 font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Voter
                    </Button>
                    {candidate.showcase_file_url && (
                      <Button 
                        onClick={() => openVideo(candidate)}
                        variant="outline"
                        className="rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-xl font-bold">{selectedCandidate?.name}</span>
              <Badge>{getCategoryLabel(selectedCandidate?.category || '')}</Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCandidate?.showcase_file_url && (
            <div className="mt-4">
              {selectedCandidate.showcase_file_url.includes('.mp4') || 
               selectedCandidate.showcase_file_url.includes('video') ? (
                <video 
                  src={selectedCandidate.showcase_file_url} 
                  controls 
                  className="w-full rounded-xl"
                  autoPlay
                />
              ) : (
                <img 
                  src={selectedCandidate.showcase_file_url} 
                  alt={selectedCandidate.name}
                  className="w-full rounded-xl"
                />
              )}
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-600">{selectedCandidate?.bio}</p>
            <div className="flex gap-4 mt-4">
              <Button 
                onClick={() => selectedCandidate && handleVote(selectedCandidate.id)}
                className="flex-1 gradient-cta text-gray-900 font-bold rounded-xl"
              >
                <Heart className="h-4 w-4 mr-2" />
                Voter pour {selectedCandidate?.name}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
