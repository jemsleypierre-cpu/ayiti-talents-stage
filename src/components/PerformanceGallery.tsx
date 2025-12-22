import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Heart, 
  Eye, 
  Share2, 
  Filter,
  Search,
  X,
  Music,
  Mic,
  Paintbrush,
  BookOpen,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SocialShare } from './SocialShare';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Performance {
  id: string;
  name: string;
  category: string;
  video_url: string;
  thumbnail_url?: string;
  likes: number;
  views: number;
  created_at: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  'singing': Mic,
  'chant': Mic,
  'dancing': Music,
  'danse': Music,
  'poetry': BookOpen,
  'poésie': BookOpen,
  'drawing': Paintbrush,
  'dessin': Paintbrush,
  'modeling': Users,
  'défilé': Users,
};

const categories = [
  { value: 'all', label: 'Tous', icon: Filter },
  { value: 'singing', label: 'Chant', icon: Mic },
  { value: 'dancing', label: 'Danse', icon: Music },
  { value: 'poetry', label: 'Poésie', icon: BookOpen },
  { value: 'drawing', label: 'Dessin', icon: Paintbrush },
  { value: 'modeling', label: 'Défilé', icon: Users },
];

export const PerformanceGallery: React.FC = () => {
  const { toast } = useToast();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Performance | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPerformances();
    loadLikedVideos();
  }, []);

  const loadPerformances = async () => {
    try {
      // Try to load from contestants table first
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'active')
        .not('showcase_file_url', 'is', null);

      if (error) throw error;

      const mappedPerformances: Performance[] = (data || []).map(contestant => ({
        id: contestant.id,
        name: contestant.name,
        category: contestant.category,
        video_url: (contestant as any).showcase_file_url || '',
        thumbnail_url: contestant.photo_url,
        likes: Math.floor(Math.random() * 500), // Placeholder until we have a likes table
        views: Math.floor(Math.random() * 2000) + 100,
        created_at: contestant.created_at,
      }));

      setPerformances(mappedPerformances);
    } catch (error) {
      console.error('Error loading performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikedVideos = () => {
    try {
      const stored = localStorage.getItem('rjt_liked_videos');
      if (stored) {
        setLikedVideos(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading liked videos:', error);
    }
  };

  const toggleLike = (performanceId: string) => {
    const newLiked = new Set(likedVideos);
    
    if (newLiked.has(performanceId)) {
      newLiked.delete(performanceId);
      toast({
        title: "Like retiré",
        description: "Vous avez retiré votre like.",
      });
    } else {
      newLiked.add(performanceId);
      toast({
        title: "❤️ Aimé!",
        description: "Vous avez aimé cette performance!",
      });
    }

    setLikedVideos(newLiked);
    localStorage.setItem('rjt_liked_videos', JSON.stringify([...newLiked]));
  };

  const filteredPerformances = performances.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category.toLowerCase()] || Music;
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="white-card animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-xl"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="white-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un talent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredPerformances.length === 0 ? (
        <div className="white-card p-12 text-center">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune performance trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos filtres ou revenez plus tard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerformances.map((performance) => {
            const Icon = CategoryIcon(performance.category);
            const isLiked = likedVideos.has(performance.id);

            return (
              <Card 
                key={performance.id} 
                className="white-card overflow-hidden group card-hover"
              >
                {/* Video Thumbnail */}
                <div 
                  className="relative aspect-video bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedVideo(performance)}
                >
                  {performance.thumbnail_url ? (
                    <img
                      src={performance.thumbnail_url}
                      alt={performance.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Icon className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 capitalize">
                    <Icon className="h-3 w-3 mr-1" />
                    {performance.category}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {performance.name}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {performance.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {performance.likes + (isLiked ? 1 : 0)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(performance.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Share functionality
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedVideo?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="p-4">
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                {selectedVideo.video_url ? (
                  <video
                    src={selectedVideo.video_url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Vidéo non disponible
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={likedVideos.has(selectedVideo.id) ? 'default' : 'outline'}
                    onClick={() => toggleLike(selectedVideo.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${likedVideos.has(selectedVideo.id) ? 'fill-current' : ''}`} />
                    {likedVideos.has(selectedVideo.id) ? 'Aimé' : 'Aimer'}
                  </Button>
                </div>

                <SocialShare
                  url={`${window.location.origin}/performance/${selectedVideo.id}`}
                  title={`Regardez la performance de ${selectedVideo.name} sur Rayon des Jeunes Talents!`}
                  candidateName={selectedVideo.name}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

