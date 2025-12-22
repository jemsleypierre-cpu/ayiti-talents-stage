import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Vote, 
  TrendingUp, 
  Eye, 
  Video, 
  Trophy,
  Calendar,
  BarChart3,
  Share2,
  Edit
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SocialShare } from './SocialShare';
import { QRCodeGenerator } from './QRCodeGenerator';

interface CandidateStats {
  total_votes: number;
  rank: number;
  total_candidates: number;
  votes_today: number;
  views: number;
}

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [candidate, setCandidate] = useState<any>(null);
  const [stats, setStats] = useState<CandidateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCandidateData();
    }
  }, [user]);

  const loadCandidateData = async () => {
    if (!user) return;

    try {
      // Load candidate application
      const { data: applicationData, error: appError } = await supabase
        .from('candidate_applications')
        .select('*')
        .eq('email', user.email)
        .single();

      if (appError && appError.code !== 'PGRST116') {
        console.error('Error loading application:', appError);
      }

      if (applicationData) {
        setCandidate(applicationData);

        // Load stats from contestants table if approved
        if (applicationData.status === 'approved') {
          const { data: contestantData } = await supabase
            .from('contestants')
            .select('*')
            .eq('name', applicationData.name)
            .single();

          if (contestantData) {
            // Calculate rank
            const { data: allContestants } = await supabase
              .from('contestants')
              .select('id, total_votes')
              .eq('status', 'active')
              .order('total_votes', { ascending: false });

            const rank = (allContestants || []).findIndex(c => c.id === contestantData.id) + 1;

            setStats({
              total_votes: contestantData.total_votes || 0,
              rank: rank,
              total_candidates: allContestants?.length || 0,
              votes_today: Math.floor(Math.random() * 50), // Placeholder
              views: Math.floor(Math.random() * 500) + 100, // Placeholder
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading candidate data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <Card className="white-card">
        <CardContent className="p-8 text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Vous n'êtes pas encore inscrit
          </h3>
          <p className="text-gray-500 mb-4">
            Inscrivez-vous au concours pour accéder à votre tableau de bord
          </p>
          <Button asChild>
            <a href="/register">S'inscrire maintenant</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">✅ Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">❌ Refusé</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ En attente</Badge>;
    }
  };

  const profileUrl = `${window.location.origin}/vote?candidate=${candidate.id}`;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="white-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary h-24"></div>
        <CardContent className="-mt-12 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="relative">
              {candidate.photo_url ? (
                <img
                  src={candidate.photo_url}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/20 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-10 w-10 text-primary" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2">
                {getStatusBadge(candidate.status)}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-500 capitalize">{candidate.category} • {candidate.location}</p>
            </div>

            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier le profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="white-card">
            <CardContent className="p-4 text-center">
              <Vote className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.total_votes}</p>
              <p className="text-sm text-gray-500">Votes totaux</p>
            </CardContent>
          </Card>

          <Card className="white-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">#{stats.rank}</p>
              <p className="text-sm text-gray-500">Classement</p>
            </CardContent>
          </Card>

          <Card className="white-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">+{stats.votes_today}</p>
              <p className="text-sm text-gray-500">Votes aujourd'hui</p>
            </CardContent>
          </Card>

          <Card className="white-card">
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.views}</p>
              <p className="text-sm text-gray-500">Vues du profil</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress to Top */}
      {stats && stats.rank > 1 && (
        <Card className="white-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Progression vers le Top
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votre position: #{stats.rank}</span>
                <span>Objectif: Top 10</span>
              </div>
              <Progress 
                value={Math.max(0, ((stats.total_candidates - stats.rank) / stats.total_candidates) * 100)} 
                className="h-3"
              />
              <p className="text-sm text-gray-500">
                {stats.rank <= 10 
                  ? "🎉 Félicitations! Vous êtes dans le Top 10!"
                  : `Continuez à partager pour monter dans le classement!`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share & QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="white-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Partagez votre profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Plus vous partagez, plus vous avez de chances de recevoir des votes!
            </p>
            <SocialShare
              url={profileUrl}
              title={`Votez pour ${candidate.name}`}
              candidateName={candidate.name}
            />
          </CardContent>
        </Card>

        <QRCodeGenerator
          value={profileUrl}
          title="Votre QR Code"
          candidateName={candidate.name}
          size={150}
        />
      </div>

      {/* Recent Activity */}
      <Card className="white-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Vote className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Vous avez reçu 5 nouveaux votes</span>
              <span className="text-green-600 text-sm ml-auto">Il y a 2h</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">12 personnes ont vu votre profil</span>
              <span className="text-blue-600 text-sm ml-auto">Il y a 5h</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800">Vous êtes monté de 2 places!</span>
              <span className="text-purple-600 text-sm ml-auto">Hier</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

