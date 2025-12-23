// Rayon des Jeunes Talents - Updated via Cursor
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Trophy, Music, Search, Video } from 'lucide-react';
import heroImage from '@/assets/hero-talent.jpg';
import singingPerformanceHero from '@/assets/singing-performance-hero.jpg';
import { WelcomeImageGenerator } from '@/components/WelcomeImageGenerator';
import { CountdownBanner } from '@/components/CountdownBanner';
import { Leaderboard } from '@/components/Leaderboard';
import { SponsorsSection } from '@/components/SponsorsSection';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [currentHeroImage, setCurrentHeroImage] = React.useState(singingPerformanceHero);

  
  const handleImageGenerated = (imageUrl: string) => {
    setCurrentHeroImage(imageUrl);
  };

  const features = [
    {
      icon: Music,
      title: 'Talents Variés',
      description: 'Chant, danse, poésie, dessin, défilé et plus'
    },
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Connectez-vous avec d\'autres talents'
    },
    {
      icon: Trophy,
      title: 'Compétition Équitable',
      description: 'Un vote par jour pour chaque utilisateur'
    },
    {
      icon: Star,
      title: 'Mise en Avant',
      description: 'Showcasez votre talent au monde entier'
    }
  ];

  // Date de clôture des inscriptions (à ajuster selon vos besoins)
  const registrationDeadline = new Date('2026-03-31T23:59:59');

  return (
    <div className="min-h-screen gradient-teal">
      {/* Countdown Banner */}
      <div className="pt-40">
        <CountdownBanner 
          targetDate={registrationDeadline}
          title="Inscriptions ouvertes!"
          subtitle="31 Mars 2026"
        />
      </div>

      {/* Hero Section - Podcast Style */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden px-4 py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Hero Image with Person */}
          <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
            <div className="relative mt-8">
              <div className="absolute -inset-6 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl"></div>
              <img 
                src={currentHeroImage} 
                alt="Talent" 
                className="relative w-80 h-auto lg:w-[420px] lg:h-auto rounded-3xl object-cover border-4 border-white/30 shadow-2xl"
              />
              {/* Play button overlay */}
              <button className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-y-[8px] border-y-transparent ml-1"></div>
              </button>
            </div>

            {/* White Card Content */}
            <div className="white-card p-8 flex-1 max-w-lg">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                RÉVÉLEZ VOTRE TALENT, VIVEZ VOTRE RÊVE
              </h1>
              <p className="text-gray-600 mb-6">
                Participez au concours de talents pour les jeunes haïtiens. Chantez, dansez, créez et gagnez!
              </p>
              <Button className="w-full gradient-cta text-gray-900 font-bold px-8 py-6 rounded-2xl text-lg pulse-yellow hover:scale-105 transition-transform">
                <Link to="/register" className="flex items-center justify-center w-full">
                  COMMENCER MAINTENANT
                </Link>
              </Button>
            </div>
            </div>
            
          {/* Search Bar */}
          <div className="search-bar flex items-center gap-3 max-w-xl mx-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un talent..."
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <Button size="sm" className="rounded-full bg-primary text-white px-4">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories - Pill Style */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button className="pill pill-active">Récents</button>
            <button className="pill pill-inactive">Chant</button>
            <button className="pill pill-inactive">Danse</button>
            <button className="pill pill-inactive">Poésie</button>
            <button className="pill pill-inactive">Dessin</button>
            <button className="pill pill-inactive">Défilé</button>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="white-card p-5 text-center card-hover cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl mb-4 mx-auto bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Featured Card - Podcast Style */}
          <div className="white-card overflow-hidden card-hover">
            <div className="flex flex-col md:flex-row">
              <img 
                src={currentHeroImage} 
                alt="Featured Talent" 
                className="w-full md:w-32 h-32 object-cover"
              />
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    ⭐ EN VEDETTE
                  </span>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20">
                    <Star className="h-5 w-5 text-accent" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Talent en Vedette</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Découvrez notre sélection de talents exceptionnels
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4 text-primary" />
                    <span>150+ talents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>25K votes</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <Button className="rounded-full w-12 h-12 bg-accent hover:bg-accent/90 text-gray-900">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Meet the Team Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="white-card p-10 card-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rencontrez les visionnaires passionnés derrière cette initiative
            </p>
            <Button className="gradient-cta text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform">
              <Link to="/organisateurs" className="flex items-center">
                Découvrir l'Équipe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🏆 Classement en Direct</h2>
            <p className="text-white/70">Découvrez les candidats les plus populaires</p>
          </div>
          <Leaderboard limit={5} showTitle={false} />
          <div className="text-center mt-6">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
              <Link to="/vote" className="flex items-center gap-2">
                Voir tous les candidats
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Final CTA - Dark Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Rejoignez le Mouvement
            </h2>
          <p className="text-lg text-gray-400 mb-8">
              Ensemble, célébrons la richesse culturelle d'Haïti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-cta text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform">
                <Link to="/register">
                  S'inscrire
                </Link>
              </Button>
            <Button variant="outline" className="text-lg px-8 py-4 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10">
                <Link to="/vote">
                  Voter
                </Link>
              </Button>
            </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-500">
            <Link to="/contestants" className="hover:text-white transition-colors">Candidats</Link>
            <Link to="/news" className="hover:text-white transition-colors">Actualités</Link>
            <Link to="/organisateurs" className="hover:text-white transition-colors">Organisateurs</Link>
            <Link to="/performance-videos" className="hover:text-white transition-colors">Vidéos</Link>
          </div>
        </div>
      </section>
    </div>
  );
};