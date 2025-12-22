import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardCandidate {
  id: string;
  name: string;
  category: string;
  photo_url: string | null;
  total_votes: number;
  rank: number;
}

interface LeaderboardProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  limit = 10,
  showTitle = true,
  compact = false
}) => {
  const [candidates, setCandidates] = useState<LeaderboardCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contestants' },
        () => {
          loadLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('id, name, category, photo_url, total_votes')
        .eq('status', 'active')
        .order('total_votes', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const ranked = (data || []).map((candidate, index) => ({
        ...candidate,
        rank: index + 1
      }));

      setCandidates(ranked);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="white-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card className="white-card">
        <CardContent className="p-6 text-center text-gray-500">
          Aucun candidat pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="white-card overflow-hidden">
      {showTitle && (
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Classement en Direct
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-3' : 'p-6'}>
        <div className="space-y-3">
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${getRankBg(candidate.rank)}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(candidate.rank)}
              </div>
              
              <div className="relative">
                {candidate.photo_url ? (
                  <img
                    src={candidate.photo_url}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {candidate.name.charAt(0)}
                    </span>
                  </div>
                )}
                {candidate.rank <= 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                    {candidate.rank === 1 && <span>🥇</span>}
                    {candidate.rank === 2 && <span>🥈</span>}
                    {candidate.rank === 3 && <span>🥉</span>}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {candidate.name}
                </h4>
                <p className="text-sm text-gray-500 capitalize">
                  {candidate.category}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold text-primary">
                  {candidate.total_votes.toLocaleString()}
                </span>
                <p className="text-xs text-gray-500">votes</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

