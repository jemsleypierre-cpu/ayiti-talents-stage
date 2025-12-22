import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  Play, 
  Trash2, 
  FileVideo, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';

interface PerformanceVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  file_size?: number;
  file_format?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const VideoUploadManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<PerformanceVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load user's videos
  const loadVideos = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('performance_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos((data || []) as PerformanceVideo[]);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos vidéos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Format non supporté',
        description: 'Veuillez sélectionner un fichier MP4, MOV ou AVI.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale autorisée est de 100MB.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
  };

  // Upload video
  const handleUpload = async () => {
    if (!user || !selectedFile || !title.trim()) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez remplir tous les champs requis.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('performance-videos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('performance-videos')
        .getPublicUrl(fileName);

      // Save video metadata to database
      const { data, error } = await supabase
        .from('performance_videos')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          video_url: urlData.publicUrl,
          file_size: selectedFile.size,
          file_format: selectedFile.type,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      
      // Reload videos
      loadVideos();

      toast({
        title: 'Vidéo uploadée avec succès!',
        description: 'Votre vidéo est en attente de révision par les administrateurs.',
      });

    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Erreur d\'upload',
        description: 'Impossible d\'uploader votre vidéo. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete video
  const handleDelete = async (video: PerformanceVideo) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    try {
      // Extract file path from URL
      const url = new URL(video.video_url);
      const filePath = url.pathname.split('/').slice(-2).join('/'); // user_id/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('performance-videos')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion error:', storageError);

      // Delete from database
      const { error } = await supabase
        .from('performance_videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      // Reload videos
      loadVideos();

      toast({
        title: 'Vidéo supprimée',
        description: 'La vidéo a été supprimée avec succès.',
      });

    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la vidéo.',
        variant: 'destructive',
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Inconnue';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          label: 'En attente' 
        };
      case 'approved':
        return { 
          icon: CheckCircle, 
          color: 'bg-green-100 text-green-800 border-green-200', 
          label: 'Approuvée' 
        };
      case 'rejected':
        return { 
          icon: XCircle, 
          color: 'bg-red-100 text-red-800 border-red-200', 
          label: 'Rejetée' 
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          label: 'Inconnu' 
        };
    }
  };

  // Load videos on component mount
  React.useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user, loadVideos]);

  if (!user) {
    return (
      <Card className="glass-card rounded-3xl p-8 text-center">
        <CardContent>
          <FileVideo className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Connexion requise
          </h3>
          <p className="text-muted-foreground">
            Vous devez être connecté pour uploader des vidéos de performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <Card className="glass-card rounded-3xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Upload className="h-6 w-6 text-primary" />
            Uploader une Vidéo de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Titre de la performance *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Performance de chant - Konpa moderne"
                className="dark-search"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Fichier vidéo *
              </label>
              <Input
                type="file"
                accept="video/mp4,video/mov,video/avi,video/quicktime"
                onChange={handleFileSelect}
                className="dark-search"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description (optionnelle)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre performance, le style, l'inspiration..."
              className="dark-search min-h-[100px]"
            />
          </div>

          {selectedFile && (
            <div className="bg-muted/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <FileVideo className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !title.trim()}
            className="w-full modern-button gradient-green text-gray-900 font-semibold rounded-2xl py-3"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Uploader la Vidéo
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Formats supportés: MP4, MOV, AVI • Taille max: 100MB
          </p>
        </CardContent>
      </Card>

      {/* Videos List */}
      <Card className="glass-card rounded-3xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileVideo className="h-6 w-6 text-primary" />
            Mes Vidéos ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des vidéos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <FileVideo className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aucune vidéo uploadée
              </h3>
              <p className="text-muted-foreground">
                Commencez par uploader votre première performance !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => {
                const statusInfo = getStatusInfo(video.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div
                    key={video.id}
                    className="dark-card rounded-2xl p-4 hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <FileVideo className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {video.title}
                          </h3>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        {video.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatFileSize(video.file_size)}</span>
                          <span>{video.file_format}</span>
                          <span>{new Date(video.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>

                        {video.admin_notes && (
                          <div className="mt-2 p-2 bg-muted/20 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              <strong>Note admin:</strong> {video.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(video.video_url, '_blank')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl border-red-300 hover:bg-red-50 text-red-600"
                          onClick={() => handleDelete(video)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};