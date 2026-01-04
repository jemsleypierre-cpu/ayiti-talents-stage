import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export const SponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      // Table sponsors n'existe pas encore - utiliser des données vides
      // TODO: Créer la table sponsors dans la base de données
      setSponsors([]);
    } catch (error) {
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierStyles = (tier: Sponsor['tier']) => {
    switch (tier) {
      case 'platinum':
        return {
          bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
          border: 'border-gray-300',
          size: 'h-24 w-48',
          text: 'text-gray-700'
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          border: 'border-yellow-300',
          size: 'h-20 w-40',
          text: 'text-yellow-700'
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          size: 'h-16 w-32',
          text: 'text-gray-600'
        };
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
          border: 'border-orange-200',
          size: 'h-14 w-28',
          text: 'text-orange-700'
        };
    }
  };

  const groupedSponsors = {
    platinum: sponsors.filter(s => s.tier === 'platinum'),
    gold: sponsors.filter(s => s.tier === 'gold'),
    silver: sponsors.filter(s => s.tier === 'silver'),
    bronze: sponsors.filter(s => s.tier === 'bronze'),
  };

  const hasSponsors = sponsors.length > 0;

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">Nos Partenaires</h2>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto">
            {hasSponsors 
              ? 'Merci à nos sponsors qui rendent ce concours possible'
              : 'Devenez notre premier partenaire et soutenez les jeunes talents haïtiens!'
            }
          </p>
        </div>

        {hasSponsors ? (
          <>
            {/* Platinum Sponsors */}
            {groupedSponsors.platinum.length > 0 && (
              <div className="mb-8">
                <h3 className="text-center text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Partenaire Principal
                </h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  {groupedSponsors.platinum.map((sponsor) => {
                    const styles = getTierStyles(sponsor.tier);
                    return (
                      <a
                        key={sponsor.id}
                        href={sponsor.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.bg} ${styles.border} ${styles.size} rounded-2xl border-2 flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg group relative`}
                      >
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full p-4 object-contain" />
                        ) : (
                          <span className={`font-semibold ${styles.text} text-center px-2`}>{sponsor.name}</span>
                        )}
                        {sponsor.website && (
                          <ExternalLink className="h-4 w-4 absolute top-2 right-2 opacity-0 group-hover:opacity-50" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gold Sponsors */}
            {groupedSponsors.gold.length > 0 && (
              <div className="mb-8">
                <h3 className="text-center text-sm font-semibold text-yellow-400/80 uppercase tracking-wider mb-4">
                  Partenaires Or
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {groupedSponsors.gold.map((sponsor) => {
                    const styles = getTierStyles(sponsor.tier);
                    return (
                      <a
                        key={sponsor.id}
                        href={sponsor.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.bg} ${styles.border} ${styles.size} rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg`}
                      >
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full p-3 object-contain" />
                        ) : (
                          <span className={`font-medium text-sm ${styles.text} text-center px-2`}>{sponsor.name}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Silver Sponsors */}
            {groupedSponsors.silver.length > 0 && (
              <div className="mb-8">
                <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Partenaires Argent
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {groupedSponsors.silver.map((sponsor) => {
                    const styles = getTierStyles(sponsor.tier);
                    return (
                      <a
                        key={sponsor.id}
                        href={sponsor.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.bg} ${styles.border} ${styles.size} rounded-lg border flex items-center justify-center transition-all hover:scale-105`}
                      >
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full p-2 object-contain" />
                        ) : (
                          <span className={`font-medium text-xs ${styles.text} text-center px-2`}>{sponsor.name}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bronze Sponsors */}
            {groupedSponsors.bronze.length > 0 && (
              <div className="mb-8">
                <h3 className="text-center text-sm font-semibold text-orange-400/80 uppercase tracking-wider mb-4">
                  Partenaires Bronze
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {groupedSponsors.bronze.map((sponsor) => {
                    const styles = getTierStyles(sponsor.tier);
                    return (
                      <a
                        key={sponsor.id}
                        href={sponsor.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.bg} ${styles.border} ${styles.size} rounded-lg border flex items-center justify-center transition-all hover:scale-105`}
                      >
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full p-2 object-contain" />
                        ) : (
                          <span className={`font-medium text-xs ${styles.text} text-center px-1`}>{sponsor.name}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Sponsors Yet - Placeholder */
          <div className="white-card p-8 max-w-2xl mx-auto text-center">
            <Handshake className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Espace Partenaires
            </h3>
            <p className="text-gray-600 mb-4">
              Votre logo pourrait apparaître ici! Soutenez les jeunes talents haïtiens en devenant partenaire.
            </p>
          </div>
        )}

        {/* Become a Sponsor CTA */}
        <div className="mt-10 text-center">
          <Card className="inline-block bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <p className="text-white mb-3">Intéressé à devenir partenaire?</p>
              <a
                href="mailto:rayondesjeunetalents@gmail.com"
                className="inline-flex items-center gap-2 bg-accent text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-accent/90 transition-colors"
              >
                <Handshake className="h-4 w-4" />
                Contactez-nous
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
