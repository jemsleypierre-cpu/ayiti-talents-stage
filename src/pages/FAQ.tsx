import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Inscription',
    question: 'Comment puis-je m\'inscrire au concours?',
    answer: 'Pour vous inscrire, rendez-vous sur la page d\'inscription, remplissez le formulaire avec vos informations personnelles, choisissez votre catégorie de talent, uploadez votre vidéo de performance et payez les frais d\'inscription de 1000 Gourdes via NatCash ou MonCash.'
  },
  {
    category: 'Inscription',
    question: 'Quels sont les frais d\'inscription?',
    answer: 'Les frais d\'inscription sont de 1000 Gourdes haïtiennes. Vous pouvez payer via NatCash au numéro +509 32 08 4512 ou utiliser notre option de paiement en ligne MonCash.'
  },
  {
    category: 'Inscription',
    question: 'Quelle est la limite d\'âge pour participer?',
    answer: 'Le concours est ouvert aux jeunes talents haïtiens. Il n\'y a pas de limite d\'âge stricte, mais le concours vise principalement les jeunes.'
  },
  {
    category: 'Inscription',
    question: 'Quelles catégories de talents sont acceptées?',
    answer: 'Nous acceptons: Chant, Danse, Poésie/Slam, Dessin, et Défilé de Mannequin. D\'autres catégories peuvent être ajoutées selon la demande.'
  },
  {
    category: 'Vote',
    question: 'Comment fonctionne le système de vote?',
    answer: 'Chaque utilisateur peut voter une fois par jour pour maintenir l\'équité. Les votes sont comptabilisés en temps réel et le classement est mis à jour instantanément.'
  },
  {
    category: 'Vote',
    question: 'Puis-je voter plusieurs fois pour le même candidat?',
    answer: 'Vous pouvez voter une fois par jour. Revenez chaque jour pour soutenir votre candidat préféré!'
  },
  {
    category: 'Prix',
    question: 'Quels sont les prix à gagner?',
    answer: '1ère Place: 30,000 Gourdes + Trophée + Reconnaissance officielle. 2ème Place: 15,000 Gourdes + Trophée. 3ème Place: Prix à déterminer + Trophée + Reconnaissance spéciale.'
  },
  {
    category: 'Prix',
    question: 'Comment les gagnants sont-ils sélectionnés?',
    answer: 'Les gagnants sont sélectionnés selon une combinaison des votes du public et de l\'évaluation du jury. Les critères incluent l\'originalité, la technique, et l\'impact émotionnel.'
  },
  {
    category: 'Vidéo',
    question: 'Quels formats de vidéo sont acceptés?',
    answer: 'Nous acceptons les formats MP4, MOV, et AVI. La qualité HD (1080p) est recommandée. La durée idéale est de 3-5 minutes maximum.'
  },
  {
    category: 'Vidéo',
    question: 'Que doit contenir ma vidéo de performance?',
    answer: 'Votre vidéo doit montrer votre talent de manière claire. Assurez-vous d\'avoir un bon éclairage, un audio clair, et un contenu approprié pour tous les âges.'
  },
  {
    category: 'Général',
    question: 'Puis-je modifier mon inscription après soumission?',
    answer: 'Contactez-nous par email à rayondesjeunetalents@gmail.com pour toute modification de votre inscription.'
  },
  {
    category: 'Général',
    question: 'Comment contacter les organisateurs?',
    answer: 'Vous pouvez nous contacter par email à rayondesjeunetalents@gmail.com, par téléphone au +509 32 08 4512, ou via notre formulaire de contact.'
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(faqData.map(item => item.category))];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen gradient-teal py-8 px-4 pt-48">
      <div className="container mx-auto max-w-4xl">
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
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions Fréquentes 🤔
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur le concours Rayon des Jeunes Talents
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="white-card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <Card 
              key={index} 
              className="white-card overflow-hidden cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <p className="text-gray-600 mt-3">{item.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="white-card p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune question trouvée
            </h3>
            <p className="text-gray-500">
              Essayez avec d'autres mots-clés ou{' '}
              <Link to="/contact" className="text-primary hover:underline">
                contactez-nous
              </Link>
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 white-card p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Vous n'avez pas trouvé votre réponse?
          </h3>
          <p className="text-gray-600 mb-4">
            Notre équipe est là pour vous aider
          </p>
          <Button asChild className="gradient-cta text-gray-900 font-bold px-8 py-3 rounded-full">
            <Link to="/contact">
              Contactez-nous
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

