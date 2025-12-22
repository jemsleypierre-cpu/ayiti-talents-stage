import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/rayondesjeunestalents', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/rayondesjeunestalents', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@rayondesjeunestalents', label: 'YouTube' },
  ];

  const quickLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Inscription', path: '/register' },
    { label: 'Candidats', path: '/contestants' },
    { label: 'Voter', path: '/vote' },
    { label: 'Actualités', path: '/news' },
  ];

  const legalLinks = [
    { label: 'Conditions d\'utilisation', path: '/terms' },
    { label: 'Politique de confidentialité', path: '/privacy' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/18780dde-63fa-49aa-acc7-aa135ebe7d2e.png" 
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold">Rayon des Jeunes Talents</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Révéler et célébrer les talents cachés de la jeunesse haïtienne. 
              Ensemble, construisons l'avenir artistique d'Haïti.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    title={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
              {/* TikTok */}
              <a
                href="https://tiktok.com/@rayondesjeunestalents"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                title="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/organisateurs"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Organisateurs
                </Link>
              </li>
              <li>
                <Link 
                  to="/winners"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Gagnants
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:rayondesjeunetalents@gmail.com" className="hover:text-white">
                  rayondesjeunetalents@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+50932084512" className="hover:text-white">
                  +509 32 08 4512 (Haïti)
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+19293694781" className="hover:text-white">
                  +1 929 369 4781 (USA)
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Haïti & New York, USA</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email..."
                  className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} Rayon des Jeunes Talents. Tous droits réservés.
            </p>
            <p className="flex items-center gap-1">
              Fait avec <Heart className="h-4 w-4 text-red-500 fill-current" /> pour la jeunesse haïtienne
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

