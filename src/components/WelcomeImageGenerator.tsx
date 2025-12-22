import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles } from 'lucide-react';

interface WelcomeImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

export const WelcomeImageGenerator: React.FC<WelcomeImageGeneratorProps> = ({ onImageGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateWelcomeImage = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `Create a vibrant and inspiring welcome image for "Rayon des Jeunes Talents" (Ray of Young Talents). The image should feature a diverse group of 6-8 young Haitian people (ages 16-25) showcasing different talents: someone singing with a microphone, a dancer in motion, an artist painting, a poet with a book, and musicians with instruments. The scene should be energetic and celebratory, with warm golden lighting and rich colors representing Haiti. Include the text "RAYON DES JEUNES TALENTS" prominently displayed as a beautiful logo overlay in elegant, modern typography with gold and green accents. The background should have subtle Haitian cultural elements like traditional patterns or the colors of the Haitian flag (blue and red) integrated tastefully. The overall mood should be uplifting, inspirational, and showcase the vibrancy of Haitian youth culture and creativity. High quality, professional photography style, ultra detailed, 4K resolution.`;

      const { data, error } = await supabase.functions.invoke('generate-welcome-image', {
        body: { 
          prompt,
          size: '1024x1024'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success && data.imageUrl) {
        onImageGenerated(data.imageUrl);
        toast({
          title: "Image générée avec succès!",
          description: "Votre image d'accueil a été créée avec le logo Rayon des Jeunes Talents.",
        });
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'image. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center">
      <Button
        onClick={generateWelcomeImage}
        disabled={isGenerating}
        className="modern-button gradient-green text-gray-900 font-semibold px-8 py-4 rounded-2xl"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Générer l'Image d'Accueil
          </>
        )}
      </Button>
    </div>
  );
};