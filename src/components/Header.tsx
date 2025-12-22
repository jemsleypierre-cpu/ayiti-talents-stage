import React from 'react';
import { useLanguage, LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Home, 
  UserPlus, 
  Users, 
  Vote, 
  Newspaper, 
  LogOut, 
  LogIn,
  User,
  Video,
  Shield
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Home, key: 'nav.home' },
    { path: '/organisateurs', icon: Users, key: 'nav.organisateurs' },
    { path: '/register', icon: UserPlus, key: 'nav.register' },
    { path: '/contestants', icon: Users, key: 'nav.contestants' },
    { path: '/performance-videos', icon: Video, key: 'Mes Vidéos' },
    { path: '/vote', icon: Vote, key: 'nav.vote' },
    { path: '/news', icon: Newspaper, key: 'nav.news' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Barre de navigation en haut */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                    className={`gap-2 ${isActive ? 'bg-primary text-white' : 'text-white hover:bg-white/20'}`}
                  >
                    <Link to={item.path}>
                      <Icon className="h-4 w-4" />
                      {item.key.startsWith('nav.') ? t(item.key) : item.key}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            {/* Login/User button */}
            <div className="flex items-center gap-3">
              {/* Jury Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-purple-400 hover:bg-purple-400/20 h-9 w-9 p-0"
                title="Espace Jury"
              >
                <Link to="/jury-auth">
                  <Shield className="h-5 w-5" />
                </Link>
              </Button>

              {/* Admin Button - visible pour tous, mais protégé par mot de passe */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-yellow-400 hover:bg-yellow-400/20 h-9 w-9 p-0"
                title="Administration"
              >
                <Link to="/admin">
                  <Shield className="h-5 w-5" />
                </Link>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Mon Tableau de Bord
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" asChild className="gap-2 bg-primary text-white hover:bg-primary/90 rounded-full px-4">
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    {t('auth.login')}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-3 flex justify-center gap-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  size="sm"
                  asChild
                  className={`flex-col gap-1 h-auto py-2 px-3 text-xs whitespace-nowrap rounded-xl ${
                    isActive ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    {item.key.startsWith('nav.') ? t(item.key) : item.key}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logo séparé en dessous */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-4 group">
          <div className="relative">
            <img 
              src="/lovable-uploads/18780dde-63fa-49aa-acc7-aa135ebe7d2e.png" 
              alt="RAYON DES JEUNES TALENTS Logo"
              className="h-24 w-24 object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            {t('app.title')}
          </span>
        </Link>
      </div>
    </header>
  );
};