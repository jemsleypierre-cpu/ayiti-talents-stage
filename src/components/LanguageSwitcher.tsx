import React, { createContext, useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

type Language = 'ht' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ht: {
    // Haitian Creole
    'app.title': 'RAYON DES JEUNES TALENTS',
    'nav.home': 'Kay',
    'nav.organisateurs': 'Òganizatè yo',
    'nav.register': 'Enskri',
    'nav.contestants': 'Kandida yo',
    'nav.vote': 'Vote',
    'nav.news': 'Nouvèl',
    'auth.login': 'Konekte',
    'auth.logout': 'Dekonekte',
    'auth.profile': 'Pwofil mwen',
    'hero.title': 'Montre talan ou!',
    'hero.subtitle': 'Konpetisyon talan yo jèn nan ayiti',
    'hero.cta': 'Kòmanse Kounye a',
    'register.title': 'Enskri kòm yon Kandida',
    'register.name': 'Non Konplè',
    'register.age': 'Laj',
    'register.email': 'Imèl',
    'register.talent': 'Kategori Talan',
    'register.submit': 'Soumèt',
    'talents.singing': 'Chante',
    'talents.dancing': 'Danse',
    'talents.drawing': 'Deseye',
    'talents.poetry': 'Poezi/Slam',
    'talents.modeling': 'Defile Manken',
    'vote.title': 'Vote pou Kandida Prefere ou',
    'vote.button': 'Vote',
    'news.title': 'Nouvèl ak Aktyalite yo',
  },
  fr: {
    // French
    'app.title': 'RAYON DES JEUNES TALENTS',
    'nav.home': 'Accueil',
    'nav.organisateurs': 'Organisateurs',
    'nav.register': 'S\'inscrire',
    'nav.contestants': 'Candidats',
    'nav.vote': 'Voter',
    'nav.news': 'Actualités',
    'auth.login': 'Se connecter',
    'auth.logout': 'Se déconnecter',
    'auth.profile': 'Mon profil',
    'hero.title': 'Révélez votre talent!',
    'hero.subtitle': 'Concours de talents pour les jeunes haïtiens',
    'hero.cta': 'Commencer Maintenant',
    'register.title': 'S\'inscrire comme Candidat',
    'register.name': 'Nom Complet',
    'register.age': 'Âge',
    'register.email': 'Email',
    'register.talent': 'Catégorie de Talent',
    'register.submit': 'Soumettre',
    'talents.singing': 'Chant',
    'talents.dancing': 'Danse',
    'talents.drawing': 'Dessin',
    'talents.poetry': 'Poésie/Slam',
    'talents.modeling': 'Défilé de Mannequin',
    'vote.title': 'Votez pour votre Candidat Préféré',
    'vote.button': 'Voter',
    'news.title': 'Actualités et Mises à jour',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ht');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ht']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-lg border border-border overflow-hidden">
        <Button
          variant={language === 'ht' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('ht')}
          className="rounded-none text-xs px-3"
        >
          Kreyòl
        </Button>
        <Button
          variant={language === 'fr' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('fr')}
          className="rounded-none text-xs px-3"
        >
          Français
        </Button>
      </div>
    </div>
  );
};