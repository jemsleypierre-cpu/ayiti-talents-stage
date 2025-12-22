import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const JuryAuth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Membres du jury (authentification locale)
  const JURY_MEMBERS = [
    { id: '1', name: 'Jean-Marc Désinor', email: 'jury1@ayititalents.com', password: '@jury123', specialty: 'Musique' },
    { id: '2', name: 'Marie-Flore Saint-Jean', email: 'jury2@ayititalents.com', password: '@jury123', specialty: 'Danse' },
    { id: '3', name: 'Patrick Sylvain', email: 'jury3@ayititalents.com', password: '@jury123', specialty: 'Chant' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Vérifier les credentials localement
    const juryMember = JURY_MEMBERS.find(
      member => member.email.toLowerCase() === email.toLowerCase() && member.password === password
    );

    if (!juryMember) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Stocker les infos du jury dans localStorage
    localStorage.setItem('jury_session', JSON.stringify({
      id: juryMember.id,
      name: juryMember.name,
      email: juryMember.email,
      specialty: juryMember.specialty,
      loggedInAt: new Date().toISOString()
    }));

    toast({
      title: "Bienvenue!",
      description: `Connecté en tant que ${juryMember.name}`,
    });

    setLoading(false);
    navigate('/jury-dashboard');
  };

  return (
    <div className="min-h-screen py-12 px-4 pt-48 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-sunset rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Espace Jury
          </h1>
          <p className="text-muted-foreground">
            Connexion réservée aux membres du jury
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Connexion Jury
            </CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder au tableau de vote
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jury@ayititalents.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Cet espace est strictement réservé aux membres du jury officiels.
                Pour tout problème d'accès, contactez l'administration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card - Système de Notation */}
        <Card className="mt-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/50 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              📊 Système de Notation
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <span className="text-2xl">🎭</span>
                <div>
                  <p className="font-bold text-white text-lg">Votes Jury: 49%</p>
                  <p className="text-white/80 text-sm">Du score total</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-bold text-white text-lg">Notes de 1 à 10</p>
                  <p className="text-white/80 text-sm">Par critère d'évaluation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-bold text-white text-lg">Commentaires détaillés</p>
                  <p className="text-white/80 text-sm">Feedback pour chaque candidat</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-white text-lg">1 vote par candidat</p>
                  <p className="text-white/80 text-sm">Par membre du jury</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

