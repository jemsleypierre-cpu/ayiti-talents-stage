import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message envoyé!",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'rayondesjeunetalents@gmail.com',
      href: 'mailto:rayondesjeunetalents@gmail.com'
    },
    {
      icon: Phone,
      label: 'Téléphone (Haïti)',
      value: '+509 32 08 4512',
      href: 'tel:+50932084512'
    },
    {
      icon: Phone,
      label: 'Téléphone (USA)',
      value: '+1 929 369 4781',
      href: 'tel:+19293694781'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+509 32 08 4512',
      href: 'https://wa.me/50932084512'
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: 'Haïti & New York, USA',
      href: null
    },
    {
      icon: Clock,
      label: 'Heures de réponse',
      value: 'Lun-Ven: 9h-18h',
      href: null
    }
  ];

  return (
    <div className="min-h-screen gradient-teal py-8 px-4 pt-48">
      <div className="container mx-auto max-w-6xl">
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
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contactez-nous 📧
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Une question? Une suggestion? Nous sommes là pour vous aider!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="white-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Message envoyé avec succès!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Nous vous répondrons dans les 24-48 heures.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="De quoi s'agit-il?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Écrivez votre message ici..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-cta text-gray-900 font-bold py-3 rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card className="white-card">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{info.label}</p>
                        {info.href ? (
                          <a 
                            href={info.href}
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-gray-900">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="white-card">
              <CardHeader>
                <CardTitle>Liens utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/faq" className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-sm text-gray-500">Questions fréquentes</p>
                </Link>
                <Link to="/register" className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <p className="font-medium text-gray-900">Inscription</p>
                  <p className="text-sm text-gray-500">Participez au concours</p>
                </Link>
                <Link to="/organisateurs" className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <p className="font-medium text-gray-900">Organisateurs</p>
                  <p className="text-sm text-gray-500">Rencontrez l'équipe</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

