import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Music, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const suggestions = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Inscription', path: '/register', icon: Music },
    { label: 'Candidats', path: '/contestants', icon: Search },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen gradient-teal flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-white/10 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎤</div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Oups! Page introuvable
        </h2>
        <p className="text-white/70 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée. 
          Mais ne vous inquiétez pas, il y a plein de talents à découvrir!
        </p>

        {/* Back Button */}
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
          className="mb-8 border-white/30 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la page précédente
        </Button>

        {/* Suggestions */}
        <div className="white-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Pages suggérées:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-primary/10 transition-colors text-gray-700 hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fun Message */}
        <p className="mt-8 text-white/50 text-sm">
          🎵 "Même les meilleurs talents se perdent parfois..." 🎵
        </p>
      </div>
    </div>
  );
};

export default NotFound;
