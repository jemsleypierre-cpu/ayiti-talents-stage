import React from 'react';
import { useLanguage } from '@/components/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Organisateurs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen gradient-teal">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 pt-48">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20 rounded-full">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Nos Organisateurs 👥
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Rencontrez l'équipe passionnée derrière Rayon des Jeunes Talents
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Founder Card */}
          <div className="white-card overflow-hidden card-hover">
            <div className="bg-gradient-to-br from-primary to-secondary h-24"></div>
            <div className="px-8 pb-8 -mt-16 relative">
                {/* Photo */}
              <div className="relative mx-auto mb-6 w-44 h-44">
                    <img 
                      src="/lovable-uploads/d449e80a-112b-4e5a-bc1c-31b872223be4.png" 
                      alt="Pasteur Pierre Jempsley, Fondateur de Rayon des Jeunes Talents"
                  className="w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
                    />
                </div>

                {/* Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pasteur Pierre Jempsley
                </h3>
                <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🌟 Fondateur
                </div>
                
                <div className="text-left space-y-3">
                  <p className="text-gray-600 leading-relaxed">
                    Fondateur de Rayon des Jeunes Talents, il s'engage à mettre en lumière les talents cachés des jeunes haïtiens.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Pasteur de l'Église de Jésus Christ Clinique Spirituelle, Photographe certifié et expert basé à New York, il est également certifié en solutions digitales, live streaming et développement web, avec une vision claire : accompagner la jeunesse vers l'excellence artistique et personnelle.
                  </p>
                  <p className="text-gray-800 leading-relaxed font-medium italic bg-gray-100 p-3 rounded-xl">
                    "L'avenir d'Haïti passe par une jeunesse inspirée, encadrée et valorisée."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Administrator Card */}
          <div className="white-card overflow-hidden card-hover">
            <div className="bg-gradient-to-br from-accent to-highlight h-24"></div>
            <div className="px-8 pb-8 -mt-16 relative">
                {/* Photo */}
              <div className="relative mx-auto mb-6 w-44 h-44">
                    <img 
                      src="/lovable-uploads/8b54fa99-25f3-4baf-beae-62acc466acd0.png" 
                      alt="Le Pasteur Herns Brenord, Administrateur Général de Rayon des Jeunes Talents"
                  className="w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
                    />
                </div>

                {/* Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pasteur Herns Brenord
                </h3>
                <div className="inline-block bg-accent text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  ⭐ Administrateur Général
                </div>
                
                <div className="text-left space-y-3">
                  <p className="text-gray-600 leading-relaxed">
                    Pasteur responsable de l'Église de Jésus Christ Clinique Spirituelle. Licencié en Sciences de l'Administration et Diplômé en Théologie, il représente officiellement Rayon des Jeunes Talents sur le terrain.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Il est actuellement en train de prendre son Master en Théologie Pratique. Basé dans le Nord d'Haïti, il coordonne toutes les activités locales et accompagne directement les candidats.
                  </p>
                  <p className="text-gray-800 leading-relaxed font-medium italic bg-gray-100 p-3 rounded-xl">
                    "Un pilier fort de la mission d'élévation des jeunes talents haïtiens."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="white-card p-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Notre Mission
              </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
                Ensemble, nous croyons que chaque jeune possède un don précieux à révéler. 
                Rayon des Jeunes Talents existe pour découvrir, valoriser et propulser les talents 
                cachés des jeunes du Nord d'Haïti et d'ailleurs, en leur offrant une plateforme 
                d'expression et d'accompagnement dans leur développement artistique.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};