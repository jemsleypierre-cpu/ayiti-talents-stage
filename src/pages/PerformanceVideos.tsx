import React from 'react';
import { VideoUploadManager } from '@/components/VideoUploadManager';
import { PerformanceGallery } from '@/components/PerformanceGallery';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Video, Upload, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PerformanceVideos: React.FC = () => {
  return (
    <div className="min-h-screen gradient-teal py-8 px-4 pt-48">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 gap-2 text-white hover:bg-white/20 rounded-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Mes Vidéos de Performance 🎬
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Uploadez et gérez vos vidéos de performance pour le concours Rayon des Jeunes Talents. 
              Toutes les vidéos sont examinées par notre équipe avant d'être approuvées.
            </p>
          </div>
        </div>

        {/* Tabs for Gallery and Upload */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/20">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Grid className="h-4 w-4 mr-2" />
              Galerie
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <PerformanceGallery />
          </TabsContent>

          <TabsContent value="upload">
            <VideoUploadManager />
          </TabsContent>
        </Tabs>
        
        {/* Guidelines */}
        <div className="mt-12 white-card rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Directives pour les Vidéos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
              <h4 className="font-bold text-green-800 mb-3 text-lg">✅ Recommandations</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Qualité vidéo HD (1080p recommandée)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Audio clair et sans bruit de fond</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Performance complète (3-5 minutes max)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Bonne éclairage et cadrage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Contenu approprié et familial</span>
                </li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <h4 className="font-bold text-red-800 mb-3 text-lg">⚠️ À éviter</h4>
              <ul className="space-y-2 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Contenu inapproprié ou offensant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Musique protégée par des droits d'auteur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Vidéos de mauvaise qualité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Performances trop longues (&gt;10 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Contenu non lié au talent présenté</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};