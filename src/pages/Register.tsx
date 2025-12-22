import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Upload, UserPlus, CheckCircle, CreditCard, Trophy, AlertCircle, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Register: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    talent: '',
    description: '',
    experience: '',
  });
  const [showcaseFile, setShowcaseFile] = useState<File | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ showcase: 0, payment: 0 });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Test de connexion Supabase
  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase
        .from('candidate_applications')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Erreur connexion:', error);
        setConnectionStatus('error');
        toast({
          title: "Erreur de connexion",
          description: `${error.message}`,
          variant: "destructive"
        });
      } else {
        setConnectionStatus('success');
        toast({
          title: "Connexion réussie!",
          description: "Supabase fonctionne correctement.",
        });
      }
    } catch (err: any) {
      setConnectionStatus('error');
      toast({
        title: "Erreur réseau",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const talentOptions = [
    { value: 'singing', label: t('talents.singing') },
    { value: 'dancing', label: t('talents.dancing') },
    { value: 'drawing', label: t('talents.drawing') },
    { value: 'poetry', label: t('talents.poetry') },
    { value: 'modeling', label: t('talents.modeling') },
  ];

  const cities = [
    'Port-au-Prince',
    'Cap-Haïtien',
    'Gonaïves',
    'Les Cayes',
    'Jacmel',
    'Jérémie',
    'Fort-Liberté',
    'Hinche',
    'Pétion-Ville',
    'Autre'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    console.log(`Uploading to bucket: ${bucket}, file: ${fileName}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Erreur upload ${bucket}: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    console.log('Upload success, URL:', publicUrl);
    return publicUrl;
  };

  const handleFileChange = (file: File | null, type: 'showcase' | 'payment') => {
    if (type === 'showcase') {
      setShowcaseFile(file);
    } else {
      setPaymentReceipt(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.age || !formData.email || !formData.phone || !formData.city || !formData.talent || !formData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // TODO: Remettre cette validation après les tests
      // if (!paymentReceipt) {
      //   throw new Error('Veuillez télécharger votre reçu de paiement');
      // }

      let showcaseFileUrl = null;
      let paymentReceiptUrl = null;

      // TODO: Réactiver les uploads après avoir configuré les buckets Supabase
      // Pour le moment, on skip les uploads pour tester la base de données
      /*
      // Upload showcase file if provided
      if (showcaseFile) {
        setUploadProgress(prev => ({ ...prev, showcase: 50 }));
        showcaseFileUrl = await uploadFile(showcaseFile, 'candidate-files', 'showcase');
        setUploadProgress(prev => ({ ...prev, showcase: 100 }));
      }

      // Upload payment receipt (optionnel pour les tests)
      if (paymentReceipt) {
        setUploadProgress(prev => ({ ...prev, payment: 50 }));
        paymentReceiptUrl = await uploadFile(paymentReceipt, 'payment-receipts', 'receipts');
        setUploadProgress(prev => ({ ...prev, payment: 100 }));
      }
      */
      console.log('Uploads désactivés pour le test - fichiers ignorés');

      // Insert the application into Supabase
      const { data, error } = await supabase
        .from('candidate_applications')
        .insert({
          name: formData.name,
          age: parseInt(formData.age),
          email: formData.email,
          phone: formData.phone,
          location: formData.city,
          category: formData.talent,
          bio: formData.description,
          notes: formData.experience || null,
          talents: [formData.talent],
          status: 'pending',
          showcase_file_url: showcaseFileUrl,
          payment_receipt_url: paymentReceiptUrl
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      console.log('Inscription réussie:', data);

      toast({
        title: "Inscription Réussie!",
        description: "Votre candidature a été soumise avec succès. Nous vous contacterons bientôt.",
      });

      // Reset form
      setFormData({
        name: '',
        age: '',
        email: '',
        phone: '',
        city: '',
        talent: '',
        description: '',
        experience: '',
      });
      setShowcaseFile(null);
      setPaymentReceipt(null);
      setUploadProgress({ showcase: 0, payment: 0 });

    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      console.error('Détails:', JSON.stringify(error, null, 2));
      
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.code) {
        errorMessage += ` (Code: ${error.code})`;
      }
      if (error.details) {
        errorMessage += ` - ${error.details}`;
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-48 bg-background">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-glow border border-border bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-primary rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {t('register.title')}
            </CardTitle>
            <p className="text-muted-foreground">
              Remplissez ce formulaire pour participer au concours
            </p>
            
            {/* Bouton test connexion */}
            <div className="mt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                className="gap-2"
              >
                <Wifi className="h-4 w-4" />
                {connectionStatus === 'testing' ? 'Test en cours...' : 
                 connectionStatus === 'success' ? '✅ Connexion OK' :
                 connectionStatus === 'error' ? '❌ Erreur - Réessayer' :
                 'Tester la connexion'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Frais d'inscription – 1000 Gourdes</h3>
              </div>

              {/* Payment Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: NatCash */}
                <div className="bg-white border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">NatCash</h4>
                      <p className="text-xs text-gray-500">Transfert manuel</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
                      <span className="text-gray-600">Numéro:</span>
                      <span className="font-bold text-gray-900">+509 32 08 4512</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      Envoyez 1000 HTG et gardez le reçu
                    </p>
                  </div>
                </div>

                {/* Option 2: MonCash */}
                <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💳</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">MonCash</h4>
                      <p className="text-xs text-gray-500">Transfert manuel</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                      <span className="text-gray-600">Numéro:</span>
                      <span className="font-bold text-gray-900">+509 32 08 4512</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      Envoyez 1000 HTG et gardez le reçu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-gray-900">
                  <span className="text-2xl">🧾</span>
                  Instructions de paiement:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6 text-gray-700">
                  <li>Choisissez NatCash ou MonCash</li>
                  <li>Envoyez 1000 HTG au numéro: <strong>+509 32 08 4512</strong> (Haïti)</li>
                  <li>Ou contactez-nous au: <strong>+1 929 369 4781</strong> (USA)</li>
                  <li>Dans la note, écrivez votre nom complet et "INSCRIPTION"</li>
                  <li>Prenez une capture d'écran du reçu</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  Après le paiement:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                  <li>Prenez une capture d'écran ou photo de votre reçu de paiement</li>
                  <li>Téléchargez-le dans le formulaire dans la section "Preuve de Paiement"</li>
                </ul>
                <div className="flex items-start gap-2 mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-warning-foreground">
                    Votre inscription ne sera validée qu'après confirmation de votre paiement.
                  </p>
                </div>
              </div>
            </div>

            {/* Prizes Section */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-6 w-6 text-white" />
                <h3 className="text-lg font-semibold text-white">🏆 Ce que vous pouvez gagner</h3>
              </div>
              
              <p className="text-center font-medium text-white/90 mb-4">
                ✨ Votre talent peut changer votre vie! Voici les prix:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-300 mb-2 text-lg">🥇 1ère Place:</h4>
                  <ul className="space-y-1 text-sm text-white/95">
                    <li>• 30 000 Gourdes en prix en espèces</li>
                    <li>• Un trophée officiel</li>
                    <li>• Reconnaissance sur toutes les plateformes Rayon des jeunes talents</li>
                  </ul>
                </div>
                
                <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                  <h4 className="font-bold text-gray-200 mb-2 text-lg">🥈 2ème Place:</h4>
                  <ul className="space-y-1 text-sm text-white/95">
                    <li>• 15 000 Gourdes en prix en espèces</li>
                    <li>• Un trophée officiel</li>
                  </ul>
                </div>

                <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                  <h4 className="font-bold text-orange-300 mb-2 text-lg">🥉 3ème Place:</h4>
                  <ul className="space-y-1 text-sm text-white/95">
                    <li>• Prix à déterminer</li>
                    <li>• Un trophée officiel</li>
                    <li>• Reconnaissance spéciale</li>
                  </ul>
                </div>
              </div>

              <p className="text-center font-medium text-white/90 mt-4">
                🎉 Ne manquez pas cette chance de briller. Rayon des jeunes talents est l'endroit où les talents de la jeunesse haïtienne sont découverts et célébrés!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Informations Personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('register.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom complet"
                      required
                      className="transition-all duration-300 focus:shadow-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">{t('register.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Votre âge"
                      required
                      className="transition-all duration-300 focus:shadow-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('register.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="transition-all duration-300 focus:shadow-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+509 XXXX XXXX"
                      required
                      className="transition-all duration-300 focus:shadow-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className="transition-all duration-300 focus:shadow-card">
                      <SelectValue placeholder="Sélectionnez votre ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city.toLowerCase()}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Talent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Votre Talent</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="talent">{t('register.talent')}</Label>
                  <Select onValueChange={(value) => handleInputChange('talent', value)}>
                    <SelectTrigger className="transition-all duration-300 focus:shadow-card">
                      <SelectValue placeholder="Sélectionnez votre catégorie de talent" />
                    </SelectTrigger>
                    <SelectContent>
                      {talentOptions.map((talent) => (
                        <SelectItem key={talent.value} value={talent.value}>
                          {talent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description de votre Talent</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre talent et ce qui vous rend unique..."
                    rows={4}
                    required
                    className="transition-all duration-300 focus:shadow-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Expérience (optionnel)</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Parlez-nous de votre expérience, formations, performances précédentes..."
                    rows={3}
                    className="transition-all duration-300 focus:shadow-card"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Showcase</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Téléchargez une vidéo ou photo de votre talent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: MP4, JPG, PNG (Max: 50MB)
                  </p>
                  <input
                    type="file"
                    id="showcase-file"
                    accept="*/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'showcase')}
                    className="hidden"
                  />
                  {/* TODO: Remettre accept="image/*,video/*" après les tests */}
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('showcase-file')?.click()}
                    type="button"
                  >
                    {showcaseFile ? `✓ ${showcaseFile.name}` : 'Choisir un Fichier'}
                  </Button>
                  {uploadProgress.showcase > 0 && uploadProgress.showcase < 100 && (
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.showcase}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Preuve de Paiement *</h3>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-primary/5">
                  <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
                  <p className="text-sm text-foreground mb-2 font-medium">
                    Téléchargez votre reçu de paiement NatCash
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Capture d'écran ou photo du reçu de paiement
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG (Max: 10MB)
                  </p>
                  <input
                    type="file"
                    id="payment-receipt"
                    accept="*/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'payment')}
                    className="hidden"
                  />
                  {/* TODO: Remettre accept="image/*" après les tests */}
                  <Button 
                    variant="outline" 
                    className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => document.getElementById('payment-receipt')?.click()}
                    type="button"
                  >
                    {paymentReceipt ? `✓ ${paymentReceipt.name}` : 'Choisir le Reçu de Paiement'}
                  </Button>
                  {uploadProgress.payment > 0 && uploadProgress.payment < 100 && (
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.payment}%` }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  * Obligatoire pour valider votre inscription
                </p>
              </div>

              <Button 
                type="submit" 
                variant="talent" 
                size="lg" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('register.submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};