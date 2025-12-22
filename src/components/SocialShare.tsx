import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, MessageCircle, Share2, Link2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  candidateName?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  candidateName,
  className = ''
}) => {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const shareText = description || `Votez pour ${candidateName} sur Rayon des Jeunes Talents! 🌟`;

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  const shareToTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié!",
        description: "Le lien a été copié dans votre presse-papiers.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive"
      });
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Partager:</span>
      
      <Button
        size="sm"
        variant="outline"
        onClick={shareToFacebook}
        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0 h-9 w-9 p-0"
        title="Partager sur Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareToWhatsApp}
        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0 h-9 w-9 p-0"
        title="Partager sur WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareToTwitter}
        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-0 h-9 w-9 p-0"
        title="Partager sur Twitter"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={copyLink}
        className="bg-gray-600 hover:bg-gray-600/90 text-white border-0 h-9 w-9 p-0"
        title="Copier le lien"
      >
        <Link2 className="h-4 w-4" />
      </Button>

      {navigator.share && (
        <Button
          size="sm"
          variant="outline"
          onClick={nativeShare}
          className="bg-primary hover:bg-primary/90 text-white border-0 h-9 w-9 p-0"
          title="Plus d'options"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

