import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  Settings,
  LogOut,
  Eye,
  Trash2,
  UserCheck,
  FileText,
  Vote,
  Shield,
  Newspaper,
  Image,
  Video,
  Plus,
  Upload,
  Edit,
  Send,
  Handshake,
  Gavel,
  Key,
  Trophy,
  TrendingUp,
  ArrowLeft,
  Lock,
  Loader2,
  Mail
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ExportButton } from '@/components/ExportButton';

interface CandidateApplication {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  location: string;
  category: string;
  bio: string;
  status: string;
  talents: string[];
  showcase_file_url: string;
  payment_receipt_url: string;
  created_at: string;
}

interface ContentItem {
  id: string;
  type: 'news' | 'flyer' | 'video';
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  published: boolean;
  created_at: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface JuryMember {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  photo_url: string | null;
  specialty: string | null;
  bio: string | null;
  active: boolean;
  created_at: string;
}

export const Admin: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  
  // Auth state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [contentForm, setContentForm] = useState({
    type: 'news' as 'news' | 'flyer' | 'video',
    title: '',
    content: '',
    image_url: '',
    video_url: ''
  });
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [uploadingContent, setUploadingContent] = useState(false);

  // Sponsors state
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    website: '',
    tier: 'silver' as 'platinum' | 'gold' | 'silver' | 'bronze'
  });
  const [sponsorLogo, setSponsorLogo] = useState<File | null>(null);
  const [uploadingSponsor, setUploadingSponsor] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<{[key: string]: string}>({
    moncash_number: '3208-4512',
    natcash_number: '3208-4512',
    vote_price: '150'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Jury members state
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
  const [showJuryForm, setShowJuryForm] = useState(false);
  const [juryForm, setJuryForm] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    bio: ''
  });
  const [editingJury, setEditingJury] = useState<string | null>(null);
  const [savingJury, setSavingJury] = useState(false);

  // Supabase Auth login
  const handleAdminLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre email et mot de passe.",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message === 'Invalid login credentials' 
            ? "Email ou mot de passe incorrect." 
            : error.message,
          variant: "destructive"
        });
        setLoginLoading(false);
        return;
      }

      if (!data.user) {
        toast({
          title: "Erreur",
          description: "Échec de l'authentification",
          variant: "destructive"
        });
        setLoginLoading(false);
        return;
      }

      // Check admin role - the useAdminAuth hook will handle this
      toast({
        title: "Connexion réussie",
        description: "Vérification des droits d'accès...",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  // Check if user is admin after login
  useEffect(() => {
    if (user && !adminLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administrateur.",
        variant: "destructive"
      });
      signOut();
    }
  }, [user, isAdmin, adminLoading, signOut, toast]);

  const handleLogout = async () => {
    await signOut();
    setLoginEmail('');
    setLoginPassword('');
    navigate('/');
  };

  // Charger les candidatures
  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidate_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      
      // Calculer les stats
      const total = data?.length || 0;
      const pending = data?.filter(a => a.status === 'pending').length || 0;
      const approved = data?.filter(a => a.status === 'approved').length || 0;
      const rejected = data?.filter(a => a.status === 'rejected').length || 0;
      
      setStats({ total, pending, approved, rejected });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Approuver une candidature
  const approveApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidate_applications')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Candidature approuvée",
        description: "Le candidat a été approuvé avec succès.",
      });
      loadApplications();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Rejeter une candidature
  const rejectApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidate_applications')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Candidature rejetée",
        description: "Le candidat a été rejeté.",
      });
      loadApplications();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Supprimer une candidature
  const deleteApplication = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature?')) return;
    
    try {
      const { error } = await supabase
        .from('candidate_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Candidature supprimée",
        description: "La candidature a été supprimée.",
      });
      loadApplications();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // ========== GESTION DU CONTENU ==========
  
  // Charger le contenu
  const loadContents = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      console.error('Erreur chargement contenu:', error);
    }
  };

  // Charger les sponsors
  const loadSponsors = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error: any) {
      console.error('Erreur chargement sponsors:', error);
    }
  };

  // Charger les paramètres
  const loadSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      if (data) {
        const settingsObj: {[key: string]: string} = {};
        data.forEach((item: any) => {
          settingsObj[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error: any) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  // Charger les membres du jury
  const loadJuryMembers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('jury_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJuryMembers(data || []);
    } catch (error: any) {
      console.error('Erreur chargement jury:', error);
    }
  };

  // Ajouter/Modifier un membre du jury
  const handleSaveJury = async () => {
    if (!juryForm.name || !juryForm.email) {
      toast({
        title: "Erreur",
        description: "Nom et email sont requis",
        variant: "destructive"
      });
      return;
    }

    setSavingJury(true);
    try {
      if (editingJury) {
        // Update existing
        const updateData: any = {
          name: juryForm.name,
          email: juryForm.email.toLowerCase(),
          specialty: juryForm.specialty || null,
          bio: juryForm.bio || null
        };
        if (juryForm.password) {
          updateData.password_hash = juryForm.password;
        }

        const { error } = await (supabase as any)
          .from('jury_members')
          .update(updateData)
          .eq('id', editingJury);

        if (error) throw error;

        toast({
          title: "Jury modifié!",
          description: `${juryForm.name} a été mis à jour.`,
        });
      } else {
        // Create new
        if (!juryForm.password) {
          toast({
            title: "Erreur",
            description: "Mot de passe requis pour un nouveau membre",
            variant: "destructive"
          });
          setSavingJury(false);
          return;
        }

        const { error } = await (supabase as any)
          .from('jury_members')
          .insert({
            name: juryForm.name,
            email: juryForm.email.toLowerCase(),
            password_hash: juryForm.password,
            specialty: juryForm.specialty || null,
            bio: juryForm.bio || null,
            active: true
          });

        if (error) throw error;

        toast({
          title: "Jury ajouté!",
          description: `${juryForm.name} a été ajouté au jury.`,
        });
      }

      setJuryForm({ name: '', email: '', password: '', specialty: '', bio: '' });
      setShowJuryForm(false);
      setEditingJury(null);
      loadJuryMembers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setSavingJury(false);
    }
  };

  // Supprimer un membre du jury
  const handleDeleteJury = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre du jury?')) return;

    try {
      const { error } = await (supabase as any)
        .from('jury_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Jury supprimé",
        description: "Le membre a été supprimé du jury.",
      });
      loadJuryMembers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Toggle jury actif
  const handleToggleJuryActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('jury_members')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Statut modifié",
        description: currentStatus ? "Le membre est maintenant inactif." : "Le membre est maintenant actif.",
      });
      loadJuryMembers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Éditer un jury
  const handleEditJury = (jury: JuryMember) => {
    setJuryForm({
      name: jury.name,
      email: jury.email,
      password: '',
      specialty: jury.specialty || '',
      bio: jury.bio || ''
    });
    setEditingJury(jury.id);
    setShowJuryForm(true);
  };

  // Sauvegarder un paramètre
  const saveSetting = async (key: string, value: string) => {
    setSavingSettings(true);
    try {
      const { error } = await (supabase as any)
        .from('site_settings')
        .upsert({ 
          key, 
          value,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'key' 
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Paramètre sauvegardé",
        description: `${key} a été mis à jour.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le paramètre.",
        variant: "destructive"
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // Upload logo sponsor
  const uploadSponsorLogo = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `sponsors/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('sponsor-logos')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('sponsor-logos')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  // Ajouter un sponsor
  const handleAddSponsor = async () => {
    if (!sponsorForm.name) {
      toast({
        title: "Erreur",
        description: "Le nom du sponsor est requis.",
        variant: "destructive"
      });
      return;
    }

    setUploadingSponsor(true);

    try {
      let logoUrl = null;

      if (sponsorLogo) {
        logoUrl = await uploadSponsorLogo(sponsorLogo);
      }

      const { error } = await (supabase as any)
        .from('sponsors')
        .insert({
          name: sponsorForm.name,
          website: sponsorForm.website || null,
          tier: sponsorForm.tier,
          logo_url: logoUrl,
          is_active: true,
          display_order: sponsors.length
        });

      if (error) throw error;

      toast({
        title: "Sponsor ajouté!",
        description: `${sponsorForm.name} a été ajouté avec succès.`,
      });

      setSponsorForm({ name: '', website: '', tier: 'silver' });
      setSponsorLogo(null);
      setShowSponsorForm(false);
      loadSponsors();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du sponsor.",
        variant: "destructive"
      });
    } finally {
      setUploadingSponsor(false);
    }
  };

  // Supprimer un sponsor
  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce sponsor?')) return;

    try {
      const { error } = await (supabase as any)
        .from('sponsors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sponsor supprimé",
        description: "Le sponsor a été supprimé.",
      });
      loadSponsors();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression.",
        variant: "destructive"
      });
    }
  };

  // Toggle sponsor actif
  const handleToggleSponsorActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('sponsors')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Statut modifié",
        description: currentStatus ? "Le sponsor est maintenant masqué." : "Le sponsor est maintenant visible.",
      });
      loadSponsors();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Upload fichier contenu
  const uploadContentFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `content/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('content-files')
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('content-files')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  // Publier du contenu
  const publishContent = async () => {
    if (!contentForm.title || !contentForm.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et le contenu.",
        variant: "destructive"
      });
      return;
    }

    setUploadingContent(true);
    try {
      let imageUrl = contentForm.image_url;
      let videoUrl = contentForm.video_url;

      // Upload file if provided
      if (contentFile) {
        const url = await uploadContentFile(contentFile);
        if (contentForm.type === 'video') {
          videoUrl = url;
        } else {
          imageUrl = url;
        }
      }

      const { error } = await (supabase as any)
        .from('contents')
        .insert({
          type: contentForm.type,
          title: contentForm.title,
          content: contentForm.content,
          image_url: imageUrl || null,
          video_url: videoUrl || null,
          published: true
        });

      if (error) throw error;

      toast({
        title: "Contenu publié!",
        description: "Le contenu a été publié avec succès.",
      });

      // Reset form
      setContentForm({ type: 'news', title: '', content: '', image_url: '', video_url: '' });
      setContentFile(null);
      setShowContentForm(false);
      loadContents();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploadingContent(false);
    }
  };

  // Supprimer du contenu
  const deleteContent = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Contenu supprimé",
        description: "Le contenu a été supprimé.",
      });
      loadContents();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Toggle publié/non publié
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('contents')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? "Contenu masqué" : "Contenu publié",
        description: currentStatus ? "Le contenu n'est plus visible." : "Le contenu est maintenant visible.",
      });
      loadContents();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Charger les données quand l'admin est authentifié
  useEffect(() => {
    if (isAdmin) {
      loadApplications();
      loadContents();
      loadSponsors();
      loadSettings();
      loadJuryMembers();
    }
  }, [isAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge className="bg-yellow-500">En attente</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'singing': 'Chant',
      'dancing': 'Danse',
      'drawing': 'Dessin',
      'poetry': 'Poésie/Slam'
    };
    return labels[category] || category;
  };

  // Loading state
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/50 to-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  // Page de connexion admin - si pas connecté ou pas admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        <div className="w-full max-w-md relative">
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                <Shield className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Administration
              </CardTitle>
              <p className="text-muted-foreground">
                Connectez-vous pour accéder au panneau admin
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@ayititalents.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAdminLogin} 
                className="w-full"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>🔐 Accès réservé aux administrateurs</strong><br/>
                  <span className="text-xs">Contactez l'équipe pour obtenir un accès.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard Admin
  return (
    <div className="min-h-screen bg-background">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-card via-card/95 to-card border-b border-primary/20 p-4 shadow-lg shadow-primary/5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Administration Ayiti Talents
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: {user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📊 Statistiques</h2>
          <div className="flex gap-2">
            <ExportButton tableName="candidate_applications" fileName="candidatures" />
            <ExportButton tableName="news" fileName="actualites" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-card to-emerald-900/20 border-emerald-500/20 hover:border-emerald-500/40 transition-colors card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidatures</p>
                  <p className="text-3xl font-bold text-emerald-400">{stats.total}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <Users className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40 transition-colors card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-2xl">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-colors card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
                  <p className="text-3xl font-bold text-emerald-400">{stats.approved}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-rose-500/10 border-rose-500/20 hover:border-rose-500/40 transition-colors card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejetés</p>
                  <p className="text-3xl font-bold text-rose-400">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-rose-500/20 rounded-2xl">
                  <XCircle className="h-8 w-8 text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid grid-cols-9 w-full max-w-5xl">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Attente
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approuvés
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejetés
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              Tous
            </TabsTrigger>
            <TabsTrigger value="jury" className="gap-2">
              <Gavel className="h-4 w-4" />
              Jury
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Newspaper className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2">
              <Handshake className="h-4 w-4" />
              Sponsors
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Trophy className="h-4 w-4" />
              Résultats
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Params
            </TabsTrigger>
          </TabsList>

          {['pending', 'approved', 'rejected', 'all'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .filter(app => tabValue === 'all' || app.status === tabValue)
                    .map((app) => (
                      <Card key={app.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">{app.name}</h3>
                                {getStatusBadge(app.status)}
                                <Badge variant="outline">{getCategoryLabel(app.category)}</Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Âge:</span> {app.age} ans
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Email:</span> {app.email}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Tél:</span> {app.phone}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Ville:</span> {app.location}
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">{app.bio}</p>
                              
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>Inscrit le: {new Date(app.created_at).toLocaleDateString('fr-FR')}</span>
                                {app.showcase_file_url && (
                                  <a href={app.showcase_file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    📎 Voir showcase
                                  </a>
                                )}
                                {app.payment_receipt_url && (
                                  <a href={app.payment_receipt_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    🧾 Voir reçu
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {app.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => approveApplication(app.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approuver
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => rejectApplication(app.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteApplication(app.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {applications.filter(app => tabValue === 'all' || app.status === tabValue).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      Aucune candidature dans cette catégorie
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}

          {/* Tab Contenu */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestion du Contenu</h2>
              <Button onClick={() => setShowContentForm(!showContentForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Nouveau Contenu
              </Button>
            </div>

            {/* Formulaire de création */}
            {showContentForm && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Publier du Contenu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={contentForm.type === 'news' ? 'default' : 'outline'}
                      onClick={() => setContentForm({...contentForm, type: 'news'})}
                      className="gap-2"
                    >
                      <Newspaper className="h-4 w-4" />
                      Actualité
                    </Button>
                    <Button
                      type="button"
                      variant={contentForm.type === 'flyer' ? 'default' : 'outline'}
                      onClick={() => setContentForm({...contentForm, type: 'flyer'})}
                      className="gap-2"
                    >
                      <Image className="h-4 w-4" />
                      Flyer
                    </Button>
                    <Button
                      type="button"
                      variant={contentForm.type === 'video' ? 'default' : 'outline'}
                      onClick={() => setContentForm({...contentForm, type: 'video'})}
                      className="gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Vidéo
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={contentForm.title}
                      onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                      placeholder="Titre du contenu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenu / Description</Label>
                    <Textarea
                      value={contentForm.content}
                      onChange={(e) => setContentForm({...contentForm, content: e.target.value})}
                      placeholder="Écrivez votre contenu ici..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {contentForm.type === 'video' ? 'Fichier Vidéo' : 'Image / Flyer'}
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="content-file"
                        accept={contentForm.type === 'video' ? 'video/*' : 'image/*'}
                        onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('content-file')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {contentFile ? contentFile.name : 'Choisir un fichier'}
                      </Button>
                    </div>
                  </div>

                  {contentForm.type === 'video' && (
                    <div className="space-y-2">
                      <Label>Ou URL YouTube/Vimeo</Label>
                      <Input
                        value={contentForm.video_url}
                        onChange={(e) => setContentForm({...contentForm, video_url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={publishContent} 
                      disabled={uploadingContent}
                      className="flex-1"
                    >
                      {uploadingContent ? 'Publication...' : 'Publier'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowContentForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste du contenu */}
            <div className="space-y-4">
              {contents.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === 'news' && <Newspaper className="h-4 w-4 text-blue-500" />}
                          {item.type === 'flyer' && <Image className="h-4 w-4 text-green-500" />}
                          {item.type === 'video' && <Video className="h-4 w-4 text-red-500" />}
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant={item.published ? 'default' : 'secondary'}>
                            {item.published ? 'Publié' : 'Masqué'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-32 h-20 object-cover rounded" />
                        )}
                        {item.video_url && (
                          <a href={item.video_url} target="_blank" className="text-sm text-primary hover:underline">
                            🎥 Voir la vidéo
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Publié le {new Date(item.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePublished(item.id, item.published)}
                        >
                          {item.published ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteContent(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {contents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun contenu publié. Cliquez sur "Nouveau Contenu" pour commencer.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab Jury */}
          <TabsContent value="jury" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Gavel className="h-6 w-6" />
                Gestion du Jury ({juryMembers.length})
              </h2>
              <Button onClick={() => { setShowJuryForm(!showJuryForm); setEditingJury(null); setJuryForm({ name: '', email: '', password: '', specialty: '', bio: '' }); }} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un Membre
              </Button>
            </div>

            {/* Formulaire d'ajout/modification */}
            {showJuryForm && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    {editingJury ? 'Modifier le Membre' : 'Nouveau Membre du Jury'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jury-name">Nom complet *</Label>
                      <Input
                        id="jury-name"
                        placeholder="Jean-Pierre Dupont"
                        value={juryForm.name}
                        onChange={(e) => setJuryForm({ ...juryForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jury-email">Email *</Label>
                      <Input
                        id="jury-email"
                        type="email"
                        placeholder="jury@ayititalents.com"
                        value={juryForm.email}
                        onChange={(e) => setJuryForm({ ...juryForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jury-password">
                        Mot de passe {editingJury ? '(laisser vide pour ne pas changer)' : '*'}
                      </Label>
                      <Input
                        id="jury-password"
                        type="password"
                        placeholder="••••••••"
                        value={juryForm.password}
                        onChange={(e) => setJuryForm({ ...juryForm, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jury-specialty">Spécialité</Label>
                      <select
                        id="jury-specialty"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={juryForm.specialty}
                        onChange={(e) => setJuryForm({ ...juryForm, specialty: e.target.value })}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Chant">🎤 Chant</option>
                        <option value="Danse">💃 Danse</option>
                        <option value="Musique">🎵 Musique</option>
                        <option value="Dessin">🎨 Dessin</option>
                        <option value="Poésie">📝 Poésie/Slam</option>
                        <option value="Mannequin">👗 Mannequin</option>
                        <option value="Général">⭐ Général</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jury-bio">Biographie</Label>
                    <Textarea
                      id="jury-bio"
                      placeholder="Courte biographie du membre..."
                      value={juryForm.bio}
                      onChange={(e) => setJuryForm({ ...juryForm, bio: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveJury} 
                      disabled={savingJury}
                      className="gap-2"
                    >
                      {savingJury ? 'Sauvegarde...' : (editingJury ? 'Modifier' : 'Ajouter')}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowJuryForm(false);
                        setEditingJury(null);
                        setJuryForm({ name: '', email: '', password: '', specialty: '', bio: '' });
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des membres du jury */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {juryMembers.map((jury) => (
                <Card key={jury.id} className={`overflow-hidden ${!jury.active ? 'opacity-50' : ''}`}>
                  <div className="h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Gavel className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{jury.name}</h3>
                      <Badge variant={jury.active ? 'default' : 'secondary'}>
                        {jury.active ? '✅ Actif' : '⏸️ Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{jury.email}</p>
                    {jury.specialty && (
                      <Badge variant="outline" className="mb-2">{jury.specialty}</Badge>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditJury(jury)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant={jury.active ? "secondary" : "default"}
                        onClick={() => handleToggleJuryActive(jury.id, jury.active)}
                      >
                        {jury.active ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteJury(jury.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {juryMembers.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun membre du jury.</p>
                  <p className="text-sm">Cliquez sur "Ajouter un Membre" pour commencer.</p>
                </div>
              )}
            </div>

            {/* Info */}
            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <h4 className="font-bold flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  Accès Jury
                </h4>
                <p className="text-sm text-muted-foreground">
                  Les membres du jury peuvent se connecter sur <strong>/jury-auth</strong> avec leur email et mot de passe.
                  Leurs votes comptent pour <strong>49%</strong> du score total.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Résultats */}
          <TabsContent value="results" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Résultats & Classement
              </h2>
              <Button variant="outline" onClick={() => window.open('/results', '_blank')} className="gap-2">
                <Eye className="h-4 w-4" />
                Voir Page Publique
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-purple-500/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Votes Jury</p>
                    <p className="text-4xl font-bold text-purple-400">49%</p>
                    <p className="text-xs text-muted-foreground">Performance artistique</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Votes Payants</p>
                    <p className="text-4xl font-bold text-green-400">49%</p>
                    <p className="text-xs text-muted-foreground">150 HTG par vote</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Votes Gratuits</p>
                    <p className="text-4xl font-bold text-blue-400">2%</p>
                    <p className="text-xs text-muted-foreground">1 vote/jour</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statistiques des Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Les statistiques détaillées seront disponibles après le début des votes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Sponsors */}
          <TabsContent value="sponsors" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Handshake className="h-6 w-6" />
                Gestion des Sponsors ({sponsors.length})
              </h2>
              <Button onClick={() => setShowSponsorForm(!showSponsorForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un Sponsor
              </Button>
            </div>

            {/* Formulaire d'ajout de sponsor */}
            {showSponsorForm && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" />
                    Nouveau Sponsor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-name">Nom du Sponsor *</Label>
                      <Input
                        id="sponsor-name"
                        placeholder="Nom de l'entreprise"
                        value={sponsorForm.name}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-website">Site Web</Label>
                      <Input
                        id="sponsor-website"
                        type="url"
                        placeholder="https://www.example.com"
                        value={sponsorForm.website}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-tier">Niveau de Partenariat</Label>
                      <select
                        id="sponsor-tier"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={sponsorForm.tier}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value as any })}
                      >
                        <option value="platinum">🏆 Platinum (Principal)</option>
                        <option value="gold">🥇 Gold (Or)</option>
                        <option value="silver">🥈 Silver (Argent)</option>
                        <option value="bronze">🥉 Bronze</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-logo">Logo du Sponsor</Label>
                      <Input
                        id="sponsor-logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSponsorLogo(e.target.files?.[0] || null)}
                      />
                      {sponsorLogo && (
                        <p className="text-xs text-green-600">✓ {sponsorLogo.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddSponsor} 
                      disabled={uploadingSponsor}
                      className="gap-2"
                    >
                      {uploadingSponsor ? (
                        <>
                          <Upload className="h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Ajouter le Sponsor
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowSponsorForm(false);
                        setSponsorForm({ name: '', website: '', tier: 'silver' });
                        setSponsorLogo(null);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des sponsors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id} className={`overflow-hidden ${!sponsor.is_active ? 'opacity-50' : ''}`}>
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
                    {sponsor.logo_url ? (
                      <img 
                        src={sponsor.logo_url} 
                        alt={sponsor.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">{sponsor.name.charAt(0)}</span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <Badge variant={
                        sponsor.tier === 'platinum' ? 'default' :
                        sponsor.tier === 'gold' ? 'secondary' :
                        sponsor.tier === 'silver' ? 'outline' : 'outline'
                      }>
                        {sponsor.tier === 'platinum' && '🏆 '}
                        {sponsor.tier === 'gold' && '🥇 '}
                        {sponsor.tier === 'silver' && '🥈 '}
                        {sponsor.tier === 'bronze' && '🥉 '}
                        {sponsor.tier}
                      </Badge>
                    </div>
                    {sponsor.website && (
                      <p className="text-xs text-muted-foreground mb-3 truncate">
                        {sponsor.website}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={sponsor.is_active ? "outline" : "default"}
                        onClick={() => handleToggleSponsorActive(sponsor.id, sponsor.is_active)}
                        className="flex-1"
                      >
                        {sponsor.is_active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Visible
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Masqué
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSponsor(sponsor.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sponsors.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  <Handshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun sponsor pour le moment.</p>
                  <p className="text-sm">Cliquez sur "Ajouter un Sponsor" pour commencer.</p>
                </div>
              )}
            </div>

            {/* Export sponsors - désactivé car table non disponible */}
          </TabsContent>

          {/* Tab Paramètres */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Paramètres du Site</h2>
            </div>

            {/* Paramètres de Paiement */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  💳 Paramètres de Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* MonCash */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="moncash">Numéro MonCash</Label>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-12 h-10 bg-[#FF6B00] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">MC</span>
                      </div>
                      <Input
                        id="moncash"
                        value={settings.moncash_number || ''}
                        onChange={(e) => setSettings({ ...settings, moncash_number: e.target.value })}
                        placeholder="Ex: 3208-4512"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Numéro pour recevoir les paiements MonCash
                    </p>
                  </div>
                  <Button 
                    onClick={() => saveSetting('moncash_number', settings.moncash_number)}
                    disabled={savingSettings}
                    className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                  >
                    {savingSettings ? 'Sauvegarde...' : 'Sauvegarder MonCash'}
                  </Button>
                </div>

                {/* NatCash */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="natcash">Numéro NatCash</Label>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-12 h-10 bg-[#00A651] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">NC</span>
                      </div>
                      <Input
                        id="natcash"
                        value={settings.natcash_number || ''}
                        onChange={(e) => setSettings({ ...settings, natcash_number: e.target.value })}
                        placeholder="Ex: 3208-4512"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Numéro pour recevoir les paiements NatCash
                    </p>
                  </div>
                  <Button 
                    onClick={() => saveSetting('natcash_number', settings.natcash_number)}
                    disabled={savingSettings}
                    className="bg-[#00A651] hover:bg-[#00A651]/90"
                  >
                    {savingSettings ? 'Sauvegarde...' : 'Sauvegarder NatCash'}
                  </Button>
                </div>

                {/* Prix du vote */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="vote_price">Prix d'un Vote Payant (HTG)</Label>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-12 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Vote className="h-5 w-5 text-white" />
                      </div>
                      <Input
                        id="vote_price"
                        type="number"
                        value={settings.vote_price || '150'}
                        onChange={(e) => setSettings({ ...settings, vote_price: e.target.value })}
                        placeholder="150"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Prix en Gourdes Haïtiennes pour chaque vote payant
                    </p>
                  </div>
                  <Button 
                    onClick={() => saveSetting('vote_price', settings.vote_price)}
                    disabled={savingSettings}
                  >
                    {savingSettings ? 'Sauvegarde...' : 'Sauvegarder le prix'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu des paramètres actuels */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">📋 Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FF6B00]/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">MonCash</p>
                    <p className="text-2xl font-bold text-[#FF6B00]">{settings.moncash_number || '-'}</p>
                  </div>
                  <div className="p-4 bg-[#00A651]/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">NatCash</p>
                    <p className="text-2xl font-bold text-[#00A651]">{settings.natcash_number || '-'}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Prix Vote</p>
                    <p className="text-2xl font-bold text-primary">{settings.vote_price || '150'} HTG</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

